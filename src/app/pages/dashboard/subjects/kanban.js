"use client";

import { useEffect, useState } from "react";
import { subjectsApi } from '../../../api/subjects';
import { useUser } from '../../../context/userContext';
import SubjectCard from '../../../components/subjects/SubjectCard';
import { DndContext, closestCenter, useDroppable, DragOverlay } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import SortableItem from '../../../components/subjects/SortableItem';
import KanbanSubjectCard from '../../../components/subjects/KanbanSubjectCard';

const estados = ["inactiva", "activa", "completada"];
const estadoLabels = { inactiva: "Inactivas", activa: "Activas", completada: "Completadas" };
const estadoColors = { inactiva: "bg-gray-100", activa: "bg-blue-100", completada: "bg-green-100" };

function DroppableColumn({ estado, children, className, isOver, showPlaceholder, placeholderMateria }) {
  const { setNodeRef, isOver: isOverInternal } = useDroppable({ id: estado });
  const active = isOver !== undefined ? isOver : isOverInternal;
  return (
    <div
      ref={setNodeRef}
      id={estado}
      className={className + (active ? ' ring-2 ring-blue-400' : '')}
      style={{ minHeight: 220 }}
    >
      {children}
      {showPlaceholder && placeholderMateria && (
        <div className="opacity-40 pointer-events-none select-none mt-2">
          <KanbanSubjectCard subject={placeholderMateria} />
        </div>
      )}
    </div>
  );
}

export default function SubjectsKanban() {
  const { userId, loading } = useUser();
  const [materias, setMaterias] = useState({ inactiva: [], activa: [], completada: [] });
  const [loadingMaterias, setLoadingMaterias] = useState(true);
  const [dragged, setDragged] = useState(null);
  const [activeMateria, setActiveMateria] = useState(null);
  const [error, setError] = useState(null);
  const [overColumn, setOverColumn] = useState(null);
  const [overItemId, setOverItemId] = useState(null);
  const [resetLoading, setResetLoading] = useState(false);

  const handleResetSubjects = async () => {
    if (window.confirm('¿Estás seguro de que quieres reiniciar tus materias? ¡Perderás tu progreso!')) {
      try {
        setResetLoading(true);
        await subjectsApi.initializeUserSubjects(userId);
        // Recargar materias después de reiniciar
        const materiasConEstado = await subjectsApi.getAllSubjectsWithUserState(userId);
        // Agrupar materias por estado
        const agrupadas = { inactiva: [], activa: [], completada: [] };
        let desconocidos = [];
        materiasConEstado.forEach((materia, idx) => {
          const estado = materia.estado;
          if (!materia.id) materia.id = `materia-${estado}-${idx}`;
          if (agrupadas[estado]) {
            agrupadas[estado].push(materia);
          } else {
            desconocidos.push(materia);
          }
        });
        setMaterias(agrupadas);
        setResetLoading(false);
      } catch (err) {
        setResetLoading(false);
        setError('Error al reiniciar materias: ' + (err.message || 'Error desconocido'));
      }
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!userId) return;
    setLoadingMaterias(true);
    setError(null);
    subjectsApi.getAllSubjectsWithUserState(userId)
      .then((materiasConEstado) => {
        console.log('Materias recibidas:', materiasConEstado);
        // Inicializar el objeto de materias con arrays vacíos
        const agrupadas = {
          inactiva: [],
          activa: [],
          completada: []
        };

        // Procesar cada materia y asignarla a su columna correspondiente
        materiasConEstado.forEach((materia, idx) => {
          // Asegurar que la materia tenga un ID
          if (!materia.id) {
            materia.id = `materia-${materia.estado}-${idx}`;
          }

          // Validar que el estado sea uno de los permitidos
          if (estados.includes(materia.estado)) {
            agrupadas[materia.estado].push(materia);
          } else {
            console.warn(`Materia con estado inválido: ${materia.estado}`, materia);
            // Por defecto, asignar a inactiva si el estado no es válido
            agrupadas.inactiva.push(materia);
          }
        });

        console.log('Materias agrupadas por estado:', agrupadas);
        setMaterias(agrupadas);
        setLoadingMaterias(false);
      })
      .catch(err => {
        console.error("Error loading subjects:", err);
        setError('Error al cargar las materias: ' + (err.message || 'Error desconocido'));
        setLoadingMaterias(false);
      });
  }, [userId, loading]);

  if (loading) {
    return <div className="flex justify-center items-center h-64 text-lg text-gray-500">Cargando usuario...</div>;
  }
  if (!userId) {
    return <div className="flex justify-center items-center h-64 text-lg text-gray-500">No hay usuario autenticado</div>;
  }

  const handleDragStart = (event) => {
    setDragged(event.active.id);
    // Buscar la materia activa por id
    let found = null;
    for (const estado of estados) {
      found = materias[estado].find(m => m.id === event.active.id);
      if (found) break;
    }
    setActiveMateria(found);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over || !active) return;
    if (active.id === over.id) return;

    let fromEstado, toEstado;
    let activeSubject = null;

    for (const estado of estados) {
      const found = materias[estado].find(m => m.id === active.id);
      if (found) {
        fromEstado = estado;
        activeSubject = found;
        break;
      }
    }

    if (estados.includes(over.id)) {
      toEstado = over.id;
    } else {
      for (const estado of estados) {
        if (materias[estado].find(m => m.id === over.id)) {
          toEstado = estado;
          break;
        }
      }
    }

    if (!fromEstado || !toEstado || !activeSubject) return;

    if (fromEstado !== toEstado) {
      // Mover entre columnas
      const updatedFrom = materias[fromEstado].filter(m => m.id !== active.id);
      const updatedTo = [activeSubject, ...materias[toEstado]];
      setMaterias({
        ...materias,
        [fromEstado]: updatedFrom,
        [toEstado]: updatedTo,
      });
    } else {
      // Reordenar dentro de la misma columna
      const oldIndex = materias[fromEstado].findIndex(m => m.id === active.id);
      const newIndex = materias[toEstado].findIndex(m => m.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;
      const reordered = Array.from(materias[fromEstado]);
      const [removed] = reordered.splice(oldIndex, 1);
      reordered.splice(newIndex, 0, removed);
      setMaterias({ ...materias, [fromEstado]: reordered });
    }
    setOverColumn(toEstado);
    setOverItemId(over.id);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    console.log('[KANBAN] handleDragEnd', { active, over });
    if (!over || !active) return;

    let fromEstado, toEstado;
    let activeSubject = null;

    // Buscar estado de origen y materia activa
    for (const estado of estados) {
      const found = materias[estado].find(m => m.id === active.id);
      if (found) {
        fromEstado = estado;
        activeSubject = found;
        break;
      }
    }

    // Buscar estado destino
    if (estados.includes(over.id)) {
      toEstado = over.id;
    } else {
      for (const estado of estados) {
        if (materias[estado].find(m => m.id === over.id)) {
          toEstado = estado;
          break;
        }
      }
      if (!toEstado && over.data && over.data.current && over.data.current.sortable && over.data.current.sortable.containerId) {
        toEstado = over.data.current.sortable.containerId;
      }
    }

    // Solo continuar si ambos estados son válidos y la materia existe
    if (!fromEstado || !toEstado || !activeSubject) return;

    if (fromEstado !== toEstado) {
      // Cambio de columna: actualizar estado y orden de una sola materia
      try {
        // El nuevo orden será 0 (al principio de la columna destino)
        await subjectsApi.updateSubjectOrderAndState(userId, activeSubject.id, 0, toEstado);
        // Actualizar el frontend provisionalmente
        const updatedFrom = materias[fromEstado].filter(m => m.id !== active.id);
        const updatedTo = [activeSubject, ...materias[toEstado]];
        setMaterias({
          ...materias,
          [fromEstado]: updatedFrom,
          [toEstado]: updatedTo,
        });
        // Reordenar el resto de materias en la columna destino
        const materiasOrdenadasTo = updatedTo.map((materia, index) => ({
          id: materia.id,
          orden: index,
          estado: toEstado
        }));
        // Actualizar el orden de todas las materias en la columna destino
        await subjectsApi.updateSubjectsOrder(userId, materiasOrdenadasTo);
        // Recargar materias para evitar inconsistencias
        const materiasConEstado = await subjectsApi.getAllSubjectsWithUserState(userId);
        const agrupadas = { inactiva: [], activa: [], completada: [] };
        materiasConEstado.forEach((materia, idx) => {
          const estado = materia.estado;
          if (!materia.id) materia.id = `materia-${estado}-${idx}`;
          if (agrupadas[estado]) {
            agrupadas[estado].push(materia);
          }
        });
        setMaterias(agrupadas);
      } catch (err) {
        setError('Error al actualizar el estado u orden: ' + (err.message || 'Error desconocido'));
      }
    } else {
      // Reordenar dentro de la misma columna
      const oldIndex = materias[fromEstado].findIndex(m => m.id === active.id);
      let newIndex = materias[toEstado].findIndex(m => m.id === over.id);
      // Si se suelta en el área vacía de la columna, poner al final
      if (newIndex === -1) newIndex = materias[toEstado].length - 1;
      if (oldIndex === -1 || newIndex === -1) return;
      const reordered = Array.from(materias[fromEstado]);
      const [removed] = reordered.splice(oldIndex, 1);
      reordered.splice(newIndex, 0, removed);
      setMaterias({ ...materias, [fromEstado]: reordered });
      const materiasOrdenadas = reordered.map((materia, index) => ({
        id: materia.id,
        orden: index,
        estado: fromEstado
      }));
      await subjectsApi.updateSubjectsOrder(userId, materiasOrdenadas);
    }
    setDragged(null);
    setActiveMateria(null);
    setOverColumn(null);
    setOverItemId(null);
  };

  // Calcula el índice de inserción para el placeholder en la columna destino
  function getPlaceholderIndex(estado) {
    if (!dragged || overColumn !== estado) return -1;
    const items = materias[estado].map(m => m.id);
    if (!overItemId) {
      // Si no hay item sobrevolado, va al final (o al principio si está vacía)
      return items.length === 0 ? 0 : items.length;
    }
    const idx = items.indexOf(overItemId);
    return idx === -1 ? items.length : idx;
  }

  return (
    <div className="py-4"> {/* Reducir el padding vertical */}
      {/* Eliminar el botón de reiniciar materias */}
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Panel de Materias por Estado</h1>
      {error && (
        <div className="p-4 mb-4 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>
      )}
      {loadingMaterias ? (
        <div className="flex justify-center items-center h-64 text-lg text-gray-500">Cargando...</div>
      ) : (
        <DndContext
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {estados.map((estado) => (
              <DroppableColumn
                key={estado}
                estado={estado}
                className={`rounded-2xl p-4 shadow ${estadoColors[estado]}`}
                isOver={overColumn === estado}
                showPlaceholder={overColumn === estado}
                placeholderMateria={activeMateria}
              >
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-gray-700">{estadoLabels[estado]}</h2>
                </div>
                <SortableContext items={materias[estado].map(m => m.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-4 min-h-[200px]">
                    {(() => {
                      const placeholderIdx = getPlaceholderIndex(estado);
                      // Filtrar materias válidas
                      const items = materias[estado].filter(m => m && m.id && m.nombre);
                      if (items.length === 0) {
                        return <div className="text-gray-400 text-center">No hay materias</div>;
                      }

                      const rendered = [];
                      for (let idx = 0; idx < items.length; idx++) {
                        const materia = items[idx];
                        rendered.push(
                          <SortableItem key={materia.id || `${estado}-${idx}`} id={materia.id || `${estado}-${idx}`} containerId={estado}>
                            <KanbanSubjectCard subject={materia} />
                          </SortableItem>
                        );
                      }
                      return rendered;
                    })()}
                  </div>
                </SortableContext>
              </DroppableColumn>
            ))}
          </div>
          <DragOverlay dropAnimation={null}>
            {activeMateria ? <KanbanSubjectCard subject={activeMateria} /> : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
}
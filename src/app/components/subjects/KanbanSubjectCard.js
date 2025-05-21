export default function KanbanSubjectCard({ subject }) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 flex flex-col gap-2 hover:shadow-lg transition-shadow duration-200">
      <div className="text-lg font-bold text-gray-800">{subject.nombre}</div>
      <div className="text-sm text-green-700 font-semibold">{subject.creditos} Créditos</div>
      <div className="text-sm text-gray-500">{subject.codigo}</div>
    </div>
  );
} 
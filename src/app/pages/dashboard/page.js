import CourseCard from '../../components/courses/courseCard';

export default function Page() {
    return (
        <>
            <div className="bg-primary h-[30vh] rounded-lg mb-8">
                
            </div>
            <div className="flex flex-col">
                <h1 className='font-semibold text-black text-xl mb-4'>Explora nuevos cursos</h1>
                <div className="flex gap-6">
                    <CourseCard/>
                    <CourseCard/>
                    <CourseCard/>
                    <CourseCard/>
                    <CourseCard/>
                    <CourseCard/>
                </div>
            </div>
        </>
    );  
}
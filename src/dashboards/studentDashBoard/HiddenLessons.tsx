import AcceptedDrivingLesson from "../sharedAppointmentCards/AcceptedDrivingLesson.tsx";

export default function HiddenLessons({
  studentId,
  refreshKey,
}: {
  studentId: string;
  refreshKey: number;
}) {
  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto gap-6 py-6 bg-white overflow-x-hidden">
      {/* Header */}
      <div className="flex gap-1 w-full justify-center bg-green-700 py-2 px-3 rounded-xl text-white">
        <h5 className="text-md  text-white font-bold flex items-center gap-2">
          Gebuchte Fahrstunden
        </h5>
      </div>

      <div className="flex flex-wrap gap-2 ">
        <AcceptedDrivingLesson
          role="student"
          variant="hidden"
          studentId={studentId}
          refreshCount={refreshKey}
        />
      </div>
    </div>
  );
}

import { Circle } from "lucide-react";

export type Status = "gray" | "red" | "orange" | "green";

export default function Statuslight({ status }: { status: Status }) {
  const base = "h-5 w-5 transition-all duration-300";

  return (
    <div className="flex gap-3">
      <Circle
        className={`${base} ${
          status === "gray"
            ? "fill-zinc-400 text-zinc-400 drop-shadow-[0_0_10px_rgb(161,161,170)]"
            : "fill-zinc-700 text-zinc-700"
        }`}
      />

      <Circle
        className={`${base} ${
          status === "red"
            ? "fill-red-500 text-red-500 drop-shadow-[0_0_10px_rgb(239,68,68)]"
            : "fill-zinc-700 text-zinc-700"
        }`}
      />

      <Circle
        className={`${base} ${
          status === "orange"
            ? "fill-orange-500 text-orange-500 drop-shadow-[0_0_10px_rgb(249,115,22)]"
            : "fill-zinc-700 text-zinc-700"
        }`}
      />

      <Circle
        className={`${base} ${
          status === "green"
            ? "fill-green-500 text-green-500 drop-shadow-[0_0_10px_rgb(34,197,94)]"
            : "fill-zinc-700 text-zinc-700"
        }`}
      />
    </div>
  );
}

// import { Circle } from "lucide-react";

// export type Status = "red" | "orange" | "green" | "";

// export default function Statuslight({ status }: { status: Status }) {
//   const base = "h-5 w-5 transition-all duration-300";

//   return (
//     <div className="flex gap-3">

//       <Circle
//         className={`${base} ${
//           status === "red"
//             ? "fill-red-500 text-red-500 drop-shadow-[0_0_10px_rgb(239,68,68)]"
//             : "fill-zinc-700 text-zinc-700"
//         }`}
//       />

//       <Circle
//         className={`${base} ${
//           status === "orange"
//             ? "fill-orange-500 text-orange-500 drop-shadow-[0_0_10px_rgb(249,115,22)]"
//             : "fill-zinc-700 text-zinc-700"
//         }`}
//       />

//       <Circle
//         className={`${base} ${
//           status === "green"
//             ? "fill-green-500 text-green-500 drop-shadow-[0_0_10px_rgb(34, 197, 94)]"
//             : "fill-zinc-700 text-zinc-700"
//         }`}
//       />
//     </div>
//   );
// }

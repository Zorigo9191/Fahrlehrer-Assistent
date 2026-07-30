import { Button } from "@/components/button";
import { Field, FieldGroup, FieldLabel } from "@/components/field";
import { Input } from "@/components/input";
import { AlertTriangle, Ban, Bike, Car, Save } from "lucide-react";
import { useState } from "react";
import { createStudentWithLicenseClasses } from "./sharedService/SharedService.ts";
import { toast } from "sonner";

type StudentRegisterFormProps = {
  onClose: () => void;
};

export default function StudentRegisterForm({
  onClose,
}: StudentRegisterFormProps) {
  const bikeCategories = [
    { value: "AM", type: "bike" },
    { value: "A1", type: "bike" },
    { value: "A2", type: "bike" },
    { value: "A", type: "bike" },
  ];

  const carCategories = [
    { value: "B197", type: "car" },
    { value: "B78", type: "car" },
    { value: "B", type: "car" },
    { value: "BE", type: "car" },
  ];

  const [bikeLicense, setBikeLicense] = useState("");
  const [carLicense, setCarLicense] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  async function handleSaveStudent() {
    if (!fullName.trim() || !email.trim()) {
      toast.warning("Bitte Name und E-Mail eingeben", {
        unstyled: true,
        icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
        classNames: {
          toast:
            "flex items-center gap-3 rounded-lg border border-yellow-200 bg-yellow-50 px-5 py-4 shadow-md",
          title: "text-yellow-500 text-sm font-medium",
          icon: "flex items-center justify-center",
        },
      });

      return;
    }

    const categories = [bikeLicense, carLicense].filter(Boolean);

    const { error } = await createStudentWithLicenseClasses(
      {
        full_name: fullName,
        email: email,
      },
      categories,
    );

    //Falls E-Mail bereits vorhanden
    if (error) {
      if (
        error === "EMAIL_EXISTS" ||
        (typeof error === "object" && error.code === "23505")
      ) {
        toast.warning(
          "Dieser Schüler mit dieser E-Mail-Adresse existiert bereits",
          {
            unstyled: true,
            icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
            classNames: {
              toast:
                "flex items-center gap-3 rounded-lg border border-yellow-200 bg-yellow-50 px-5 py-4 shadow-md",
              title: "text-yellow-500 text-sm font-medium",
              icon: "flex items-center justify-center",
            },
          },
        );
        return;
      }

      // anderer Fehler

      toast.error("Schüler konnte nicht angelegt werden", {
        unstyled: true,
        icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
        classNames: {
          toast:
            "flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-5 py-4 shadow-md",
          title: "text-red-500 text-sm font-medium",
          icon: "flex items-center justify-center",
        },
      });

      return;
    }

    // erfolgreich gespeichert
    toast.success("Schüler wurde erfolgreich angelegt", {
      unstyled: true,
      icon: <Save className="h-5 w-5 text-green-400" />,
      classNames: {
        toast:
          "flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-5 py-4 shadow-md",
        title: "text-green-500 text-sm font-medium",
        icon: "flex items-center justify-center",
      },
    });

    onClose();
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSaveStudent();
      }}
      className="w-full mt-2 max-w-md mx-auto"
    >
      <FieldGroup className="space-y-5">
        <Field>
          <FieldLabel htmlFor="name">Name eingeben</FieldLabel>

          <Input
            className="border-2 border-blue-600 outline-none! ring-0! shadow-none! focus:ring-0! focus:outline-none!"
            id="name"
            type="text"
            placeholder="Max Mustermann"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="email">E-Mail-Adresse</FieldLabel>

          <Input
            className="border-2 border-blue-600 outline-none! ring-0! shadow-none! focus:ring-0! focus:outline-none!"
            id="email"
            type="email"
            placeholder="max@mustermann.de"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>

        {/* Führerscheinklassen */}
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <Bike className="text-blue-700" size={18} />

            <select
              value={bikeLicense}
              onChange={(e) => setBikeLicense(e.target.value)}
              className="rounded-sm w-18 border-2 text-black border-blue-700 px-2 py-1 text-sm outline-none focus:outline-none focus:ring-0"
            >
              <option value="" className="text-black ">
                -
              </option>

              {bikeCategories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.value}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Car className="text-blue-700" size={18} />

            <select
              value={carLicense}
              onChange={(e) => setCarLicense(e.target.value)}
              className="rounded-sm  border-2 text-black border-blue-700 px-2 py-1 text-sm"
            >
              <option value="">-</option>

              {carCategories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.value}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            type="submit"
            className="flex w-52 items-center gap-2 h-8 px-3 text-sm border-2 border-blue-700 text-black hover:bg-blue-100"
          >
            <Save className="mr-2 h-4 w-4 text-blue-700" />
            Speichern
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="flex w-52 items-center gap-2 h-8 px-3 text-sm border-2 border-blue-700 text-black hover:bg-blue-100"
          >
            <Ban className="text-blue-700" />
            Abbrechen
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}

// import { Button } from "@/components/button";
// import { Field, FieldGroup, FieldLabel } from "@/components/field";
// import { Input } from "@/components/input";
// import { AlertTriangle, Bike, Car, Save } from "lucide-react";
// import { useState } from "react";
// import {
//   createDrivingStudents,
//   createStudentLicenseClass,
// } from "./sharedService/SharedService.ts";
// import { toast } from "sonner";

// type StudentRegisterFormProps = {
//   onClose: () => void;
// };

// export default function StudentRegisterForm({
//   onClose,
// }: StudentRegisterFormProps) {
//   const bikeCategories = [
//     { value: "AM", type: "bike", color: "text-blue-700" },
//     { value: "A1", type: "bike", color: "text-blue-700" },
//     { value: "A2", type: "bike", color: "text-blue-700" },
//     { value: "A", type: "bike", color: "text-blue-700" },
//   ];

//   const carCategories = [
//     { value: "B197", type: "car", color: "text-blue-700" },
//     { value: "B78", type: "car", color: "text-blue-700" },
//     { value: "B", type: "car", color: "text-blue-700" },
//     { value: "BE", type: "car", color: "text-blue-700" },
//   ];

//   // const [showPassword, setShowPassword] = useState(false);
//   const [bikeLicense, setBikeLicense] = useState("");
//   const [carLicense, setCarLicense] = useState("");
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");

//   const categories = [bikeLicense, carLicense].filter(Boolean);
//   // const selectedBikeClass = bikeCategories.find(
//   //   (category) => category.value === bikeLicense,
//   // );

//   // const selectedCarClass = carCategories.find(
//   //   (category) => category.value === carClass,
//   // );

//   async function handleSaveStudent() {
//     if (!fullName.trim() || !email.trim()) {
//       toast.warning("Bitte Name und E-Mail eingeben", {
//         unstyled: true,
//         icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
//         classNames: {
//           toast:
//             "flex items-center gap-3 rounded-lg border border-gray-200 bg-yellow-50 px-5 py-4 shadow-md",
//           title: "text-yellow-500 text-sm font-medium",
//           icon: "flex items-center justify-center",
//         },
//       });

//       return;
//     }

//     const { data: student, error } = await createDrivingStudents({
//       full_name: fullName,
//       email: email,
//     });

//     if (error === "EMAIL_EXISTS") {
//       toast.warning(
//         "Dieser Schüler mit dieser E-Mail-Adresse existiert bereits",
//         {
//           unstyled: true,
//           icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
//           classNames: {
//             toast:
//               "flex items-center gap-3 rounded-lg border border-yellow-200 bg-yellow-50 px-5 py-4 shadow-md",
//             title: "text-yellow-500 text-sm font-medium",
//             icon: "flex items-center justify-center",
//           },
//         },
//       );

//       return;
//     }

//     const { error: licenseError } = await createStudentLicenseClass(
//       categories.map((category) => ({
//         student_id: student.id,
//         license_class: category,
//       })),
//     );

//     if (licenseError) {
//       toast.error("Führerscheinklasse konnte nicht gespeichert werden", {
//         unstyled: true,
//         icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
//         classNames: {
//           toast:
//             "flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-5 py-4 shadow-md",
//           title: "text-red-500 text-sm font-medium",
//           icon: "flex items-center justify-center",
//         },
//       });

//       return;
//     }

//     toast.success("Schüler wurde erfolgreich angelegt", {
//       unstyled: true,
//       icon: <Save className="h-5 w-5 text-green-400" />,
//       classNames: {
//         toast:
//           "flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-5 py-4 shadow-md",
//         title: "text-green-500 text-sm font-medium",
//         icon: "flex items-center justify-center",
//       },
//     });

//     onClose();
//   }

//   return (
//     <form
//       onSubmit={(e) => {
//         e.preventDefault();
//         handleSaveStudent();
//       }}
//       className="
//     w-full
//     mt-2
//     max-w-md
//     mx-auto"
//     >
//       <FieldGroup
//         className="
//           space-y-5
//           sm:space-y-6"
//       >
//         {/*  Name-Feld */}
//         <Field>
//           <FieldLabel htmlFor="name">Name eingeben</FieldLabel>

//           <Input
//             id="name"
//             type="text"
//             placeholder="Max Mustermann"
//             className="
//               h-12
//               w-full
//               rounded-xl
//               px-4
//               text-base
//               md:h-14
//             "
//             value={fullName}
//             onChange={(e) => setFullName(e.target.value)}
//           />
//         </Field>

//         {/*  E-Mail-Feld */}
//         <Field>
//           <FieldLabel htmlFor="email">E-Mail-Adresse</FieldLabel>
//           <Input
//             id="email"
//             type="email"
//             placeholder="max@mustermann.de"
//             className="h-12 w-full rounded-xl px-4 text-base md:h-14"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//         </Field>

//         {/*Fs-Klassen auswählen */}
//         <div className="flex gap-4">
//           <div className="flex items-center gap-2">
//             <Bike className="text-blue-700" size={18} />

//             <select
//               value={bikeLicense}
//               onChange={(e) => setBikeLicense(e.target.value)}
//               className="rounded-md border text-blue-700 border-blue-700 px-2 py-1 text-sm"
//             >
//               <option value="">Keine Klasse</option>

//               {bikeCategories.map((category) => (
//                 <option
//                   key={category.value}
//                   value={category.value}
//                   color={category.color}
//                 >
//                   {category.value}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="flex items-center gap-2">
//             <Car className="text-blue-700" size={18} />

//             <select
//               value={carLicense}
//               onChange={(e) => setCarLicense(e.target.value)}
//               className="rounded-md border text-blue-700 border-blue-700 px-2 py-1 text-sm"
//             >
//               <option value="">Keine Klasse</option>

//               {carCategories.map((category) => (
//                 <option
//                   key={category.value}
//                   value={category.value}
//                   color={category.color}
//                 >
//                   {category.value}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//         <div className=" flex gap-2">
//           <Button
//             variant="ghost"
//             className="h-8 w-52 px-3 text-sm border border-blue-700 text-blue-700 hover:bg-blue-100"
//             type="submit"
//           >
//             <Save className="mr-2 h-4 w-4" />
//             Speichern
//           </Button>

//           <Button
//             type="button"
//             variant="ghost"
//             onClick={onClose}
//             className="flex w-52 items-center gap-2 h-8 px-3 text-sm border border-blue-700 text-blue-700 hover:bg-blue-100"
//           >
//             Abbrechen
//           </Button>
//         </div>
//       </FieldGroup>
//     </form>
//   );
// }

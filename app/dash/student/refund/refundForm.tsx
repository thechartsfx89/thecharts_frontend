"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import HookFormInputField from "@/hooks/hookFormInput";
import HookFormSelectField from "@/hooks/hookFormSelect";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { RefundForm } from "@/utils/formValidation";
import { refundSchema } from "@/utils/formValidation";

import { showToast } from "@/utils/toast";
import IconLoader from "@/components/icon/icon-loader";
interface RefundFormProps {
  courseName: string;
  courseId: string | number;
  handleClose: () => void;
}

export default function RefundForm({ courseName, courseId, handleClose }: RefundFormProps) {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
    register
  } = useForm<RefundForm>({
    resolver: yupResolver(refundSchema) as any,
    defaultValues: {
      refund_reason: "",
      description: "",
    },
  });
  const onSubmit = async (val: any) => {
    console.log({ val })
    const { refund_reason, description } = val
    // e.preventDefault();
    // setMessage("Submitting...");

    if (!userEmail) {
      setMessage("❌ Please log in to submit a refund request.");
      return;
    }
    setLoading(true)
    try {
      // const url = `${process.env.NEXT_PUBLIC_API_URL}/refunds`;

      const payload: any = {
        refund_reason,
        description,
        course: courseId,
        payment: null
      };

      const res = await fetch(`/api/course-refund`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json.error?.message || "Failed to submit");
      showToast("success", "Request Sent")
      setLoading(false)
      handleClose()
    } catch (err: any) {
      setLoading(false)
      showToast("error", `Something went wrong`)
      setMessage(`❌ Something went wrong: ${err.message}`);
    }
  };
  const onError = (e: any) => {
    console.log({ e })
    showToast("error", "Validation Error");
  }
  return (
    <div className="max-w-lg mx-auto  py-6 px-4 ">

      <h2 className="text-dark font-semibold mb-6 text-center">Refund Request</h2>
      <h3 className="text-sm font-medium text-dark mb-4 border p-3 bg-red-300/20 rounded">Course: <span className="font-bold">{courseName ?? ""}</span></h3>

      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
        <HookFormSelectField
          label="Refund Reason"
          name="refund_reason"
          control={control}
          placeholder="Select Reason"
          options={[
            { value: "Purchased by mistake", label: "Purchased by mistake" },
            { value: "Course didn’t match description", label: "Course didn’t match description" },
            { value: "Content quality issues", label: "Content quality issues" },
            { value: "Technical issues while accessing", label: "Technical issues while accessing" },
            { value: "Accidental / duplicate payment", label: "Accidental / duplicate payment" },
            { value: "Other (please specify)", label: "Other (please specify)" },
          ]}

          error={errors.refund_reason?.message}
          required
        />
        <label className="text-sm font-medium text-dark">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          style={{ marginTop: "7px" }}
          {...register("description", { required: "Description is required" })}
          placeholder="Brief refund reason"
          className=" w-full h-28 text-sm p-2 border  rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        ></textarea>
        {errors?.description && <p className="text-red-500 text-xs" style={{ color: "red", marginTop: "2px" }}>{errors?.description?.message}</p>}
        {/* <button
          type="submit"
          className="w-full text-white font-semibold py-2 rounded-lg transition btn btn-primary"
        >
          Submit
        </button> */}
        <div className='flex justify-end'>
          <button type="submit" className="btn btn-primary btn-md ">
            {loading ?
              <> <IconLoader className="inline-block shrink-0 animate-[spin_2s_linear_infinite] align-middle ltr:mr-2 rtl:ml-2" />Loading...</> :
              "Submit"
            }
          </button>
        </div>
      </form>

      {/* {message && <p className="text-center mt-4">{message}</p>} */}
    </div>
  );
}

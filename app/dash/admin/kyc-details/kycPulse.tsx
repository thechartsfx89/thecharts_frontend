export const KycTableSkeleton = () => {
    const KycSkeletonRow = () => (
  <tr className="border animate-pulse">
    <td className="px-4 py-4">
      <div className="h-4 w-24 rounded bg-gray-300" />
    </td>

    <td className="px-4 py-4">
      <div className="h-9 w-full rounded bg-gray-200" />
    </td>

    <td className="px-4 py-4">
      <div className="h-9 w-28 rounded bg-gray-200" />
    </td>

    <td className="px-4 py-4 text-center">
      <div className="h-6 w-6 mx-auto rounded-full bg-gray-300" />
    </td>

    <td className="px-4 py-4 text-center">
      <div className="h-6 w-20 mx-auto rounded bg-gray-300" />
    </td>
  </tr>
);

  return (
   

          <tbody>
            {Array.from({ length: 4 }).map((_, index) => (
              <KycSkeletonRow key={index} />
            ))}
          </tbody>
       
    
  );
};

import React from 'react'

export default function NoDataComponent() {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 animate-pulse">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2H5V7h14v8h-4v2m-4 4h4v-4H9v4z" />
        </svg>
      </div>
      <p className="text-gray-600 mt-4 font-medium">No data found</p>
      <p className="text-sm text-gray-400">Please check your search or filters</p>
    </div>
  )
}

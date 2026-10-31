
import { ChevronDown } from "lucide-react";
import { Menu } from "@headlessui/react";
export default function CourseFilter() {
  return (
     <div className="container mx-auto flex flex-wrap gap-4">
      {/* By Skill Level */}
      <Menu as="div" className="relative">
        <Menu.Button className="flex items-center panel justify-between px-4.5 py-2 border border-black rounded-lg custom-shadow hover:bg-gray-50">
          By Skill Level <ChevronDown size={16} className="ml-2" />
        </Menu.Button>
        <Menu.Items className="absolute mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <Menu.Item>
            {({ active }) => (
              <button className={`block w-full px-4 py-2 text-left ${active ? "bg-gray-100" : ""}`}>
                Beginner
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button className={`block w-full px-4 py-2 text-left ${active ? "bg-gray-100" : ""}`}>
                Intermediate
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button className={`block w-full px-4 py-2 text-left ${active ? "bg-gray-100" : ""}`}>
                Advanced
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Menu>

      {/* By Course Type */}
      <Menu as="div" className="relative">
        <Menu.Button className="flex items-center justify-between panel px-4.5 py-2 border border-black rounded-lg custom-shadow hover:bg-gray-50">
          By Course Type <ChevronDown size={16} className="ml-2" />
        </Menu.Button>
        <Menu.Items className="absolute mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <Menu.Item>
            {({ active }) => (
              <button className={`block w-full px-4 py-2 text-left ${active ? "bg-gray-100" : ""}`}>
                Online
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button className={`block w-full px-4 py-2 text-left ${active ? "bg-gray-100" : ""}`}>
                Offline
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button className={`block w-full px-4 py-2 text-left ${active ? "bg-gray-100" : ""}`}>
                Hybrid
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Menu>

      {/* By Popularity */}
      <Menu as="div" className="relative">
        <Menu.Button className="flex items-center justify-between px-4.5 py-2 panel border border-black rounded-lg custom-shadow hover:bg-gray-50">
          By Popularity <ChevronDown size={16} className="ml-2" />
        </Menu.Button>
        <Menu.Items className="absolute mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <Menu.Item>
            {({ active }) => (
              <button className={`block w-full px-4 py-2 text-left ${active ? "bg-gray-100" : ""}`}>
                Most Enrolled
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button className={`block w-full px-4 py-2 text-left ${active ? "bg-gray-100" : ""}`}>
                Highest Rated
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Menu>

      {/* By Price */}
      <Menu as="div" className="relative">
        <Menu.Button className="flex items-center justify-between px-4.5 py-2 panel border border-black rounded-lg custom-shadow hover:bg-gray-50">
          By Price <ChevronDown size={16} className="ml-2" />
        </Menu.Button>
        <Menu.Items className="absolute mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <Menu.Item>
            {({ active }) => (
              <button className={`block w-full px-4 py-2 text-left ${active ? "bg-gray-100" : ""}`}>
                Free
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button className={`block w-full px-4 py-2 text-left ${active ? "bg-gray-100" : ""}`}>
                Under $50
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button className={`block w-full px-4 py-2 text-left ${active ? "bg-gray-100" : ""}`}>
                Premium
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Menu>
    </div>
  );
}

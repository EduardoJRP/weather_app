import { cn } from '@/utils/cn';
import React from 'react';
import { FaSearch } from 'react-icons/fa';

type Props = {
  className?: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
  onSubmit: React.FormEventHandler<HTMLFormElement> | undefined;
};

export default function SearchBox(props: Props) {
  return (
    <form
      onSubmit={props.onSubmit}
      className={cn(
        'flex relative items-center justify-center h-10',
        props.className
      )}
    >
      <input
        type="text"
        value={props.value}
        onChange={props.onChange}
        placeholder="Search"
        className="px-4 py-2 w-[230px] border border-gray-300 rounded-l-md focus:outline-none focus:border-gray-700 h-full"
      />
      <button className="px-4 py-2 bg-gray-400 text-black rounded-r-md focus:outline-none hover:bg-gray-700 hover:text-white whitespace-nowrap h-full">
        <FaSearch />
      </button>
    </form>
  );
}

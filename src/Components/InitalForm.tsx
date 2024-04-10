import React, { FC, useState, ChangeEvent } from "react";

interface InitialFormProps {
  handlePlay: (e: React.MouseEvent<HTMLInputElement>, size: number) => void;
}

const InitalForm: FC<InitialFormProps> = ({ handlePlay }) => {
  const [size, setSize] = useState<number>(10);

  const handleSizeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSize(Number(e.target.value));
  };

  return (
    <div className="mx-auto text-center flex flex-col items-center gap-4">
      <input
        className="border border-solid border-black py-1 rounded-md px-1"
        type="number"
        name="size-input"
        id="size-input"
        value={size}
        onChange={handleSizeChange}
      />
      <input
        className="border border-solid border-black rounded-md px-4 py-1"
        type="button"
        value="Submit"
        onClick={(e) => handlePlay(e, size)}
      />
    </div>
  );
};

export default InitalForm;

import { forwardRef } from "react";
import { AnyExtension, ChainedFromExtensions } from "remirror";
import { cx } from "class-variance-authority";
import * as Select from "@radix-ui/react-select";

interface HeadingSelectProps {
  chain: ChainedFromExtensions<Remirror.Extensions | AnyExtension>;
}

export const HeadingSelect = ({ chain }: HeadingSelectProps) => {
  // const currentHeading = state.doc.styles.find((style) => style.type === "heading")?.level ?? 0;
  // console.log("currentHeading :>> ", currentHeading);

  return (
    <Select.Root
      onValueChange={(value) => {
        if (value === "0") {
          chain.toggleHeading().focus().run();
          return;
        }
        chain
          .toggleHeading({ level: Number(value) })
          .focus()
          .run();
      }}
    >
      <Select.Trigger
        className="h-8 text-center rounded-md border border-slate-100 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 inline-flex items-center justify-center px-3 text-[13px] leading-none gap-2 hover:bg-slate-100 focus:shadow-[0_0_0_2px] outline-none"
        aria-label="Headings"
      >
        <Select.Value placeholder={"Heading"} />
        <Select.Icon />
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          className="overflow-hidden bg-white rounded-md shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]"
          position="popper"
          sideOffset={4}
        >
          <Select.Viewport className="p-1">
            <SelectItem value="0">Normal</SelectItem>
            <SelectItem value="1">Heading 1</SelectItem>
            <SelectItem value="2">Heading 2</SelectItem>
            <SelectItem value="3">Heading 3</SelectItem>
            <SelectItem value="4">Heading 4</SelectItem>
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

const SelectItem = forwardRef<
  React.ElementRef<typeof Select.Item>,
  React.ComponentPropsWithoutRef<typeof Select.Item>
>(({ className, children, ...props }, forwardedRef) => {
  return (
    <Select.Item
      className={cx(
        "text-[13px] leading-none text-violet11 rounded-md flex items-center h-[25px] pr-[35px] pl-[25px] relative select-none data-[disabled]:text-zinc-300 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-slate-100",
        className
      )}
      {...props}
      ref={forwardedRef}
    >
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center">
        X
      </Select.ItemIndicator>
    </Select.Item>
  );
});

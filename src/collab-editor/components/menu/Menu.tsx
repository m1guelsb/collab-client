import { Icon, useActive, useChainedCommands } from "@remirror/react";
import { MenuButton } from "./MenuButton";
import { HeadingSelect } from "./HeadingSelect";

export const Menu = () => {
  const chain = useChainedCommands();
  const active = useActive();

  return (
    <div className="w-full flex gap-1">
      <MenuButton
        onClick={() => chain.toggleBold().focus().run()}
        isActive={active.bold()}
      >
        <Icon name="bold" />
      </MenuButton>
      <MenuButton
        onClick={() => chain.toggleItalic().focus().run()}
        isActive={active.italic()}
      >
        <Icon name="italic" />
      </MenuButton>
      <MenuButton
        onClick={() => chain.toggleUnderline().focus().run()}
        isActive={active.underline()}
      >
        <Icon name="underline" />
      </MenuButton>

      <HeadingSelect chain={chain} />
    </div>
  );
};

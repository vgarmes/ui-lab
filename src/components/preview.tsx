interface Props {
  children?: React.ReactNode;
}
function Preview({ children }: Props) {
  return (
    <div className="relative z-0 mx-[-25px] my-8 flex h-[400px] w-[calc(100%_+_50px)] items-center justify-center border-t border-b bg-(--ds-background-demo) sm:mx-0 sm:w-full sm:rounded-xl sm:border-r sm:border-l sm:border-none sm:shadow-(--ds-shadow-border-small)">
      {children}
    </div>
  );
}

export default Preview;

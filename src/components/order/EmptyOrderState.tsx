
const EmptyOrderState = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
      <div className="w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center">
        <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      </div>
      <p className="text-muted-foreground">Your order is empty</p>
      <p className="text-sm text-muted-foreground mt-1">Add items from the menu to get started</p>
    </div>
  );
};

export default EmptyOrderState;

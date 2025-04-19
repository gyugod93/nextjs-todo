import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { fetchTodos } from "./api/todoApi";
import TodoList from "./components/TodoList";

export default async function Home() {
  const queryClient = new QueryClient();

  // SSR
  await queryClient.prefetchQuery({
    queryKey: ["todos", "all"],
    queryFn: () => fetchTodos(),
  });

  return (
    <div className="flex w-full max-w-4xl flex-col items-center bg-card p-6 shadow-md rounded-lg">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <TodoList />
      </HydrationBoundary>
    </div>
  );
}

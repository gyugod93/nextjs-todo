import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  createTodo,
  deleteTodo,
  fetchFilteredTodos,
  fetchTodos,
  updateTodo,
} from "../api/todoApi";
import { Todo, TodoFilter, TodoInput } from "../types/todo";

export function useTodos() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<TodoFilter>("all");

  const {
    data: todos = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["todos", filter],
    queryFn: () =>
      filter === "all" ? fetchTodos() : fetchFilteredTodos(filter),
  });

  const createTodoMutation = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const updateTodoMutation = useMutation({
    mutationFn: updateTodo,
    onMutate: async (updatedTodo: Todo) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      const previousTodos = queryClient.getQueryData<Todo[]>(["todos"]);

      if (previousTodos) {
        queryClient.setQueryData(
          ["todos"],
          previousTodos.map((todo) =>
            todo.id === updatedTodo.id ? { ...todo, ...updatedTodo } : todo
          )
        );
      }

      return { previousTodos };
    },
    onError: (err, updatedTodo, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(["todos"], context.previousTodos);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const deleteTodoMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const addTodo = (title: string) => {
    const newTodo: TodoInput = {
      title,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    createTodoMutation.mutate(newTodo);
  };

  const toggleTodo = (todo: Todo) => {
    const updatedTodo = { ...todo, completed: !todo.completed };
    updateTodoMutation.mutate(updatedTodo);
  };

  const editTodo = (id: string, title: string) => {
    const todoToUpdata = todos.find((todo) => todo.id === id);
    if (todoToUpdata) {
      const updatedTodo = { ...todoToUpdata, title };
      updateTodoMutation.mutate(updatedTodo);
    }
  };

  const removeTodo = (id: string) => {
    deleteTodoMutation.mutate(id);
  };

  return {
    todos,
    filter,
    setFilter,
    addTodo,
    toggleTodo,
    editTodo,
    removeTodo,
    isLoading,
    isError,
    error,
    isCreating: createTodoMutation.isPending,
    isUpdating: updateTodoMutation.isPending,
    isDeleting: deleteTodoMutation.isPending,
  };
}

import { Todo } from "@/app/types/todo";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

const API_URL = "http://localhost:3001/todos";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get("filter") || "all";

  let url = API_URL; // 기본 URL 설정
  if (filter === "active") {
    url += "?completed=false";
  } else if (filter === "completed") {
    url += "?completed=true";
  }

  console.log("Fetching todos from:", url); // 디버깅 로그

  const response = await fetch(url); // 올바른 URL로 요청
  if (!response.ok) {
    console.error("Failed to fetch todos:", response.status);
    return NextResponse.json(
      { error: "Failed to fetch todos" },
      { status: 500 }
    );
  }

  const todos = await response.json();
  console.log("Fetched todos:", todos); // 반환 데이터 확인

  todos.sort(
    (a: Todo, b: Todo) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return NextResponse.json(todos);
}

// POST: Create a new todo
export async function POST(request: Request) {
  const todoInput = await request.json();
  console.log("Received todoInput:", todoInput); // 디버깅 로그

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...todoInput,
      id: uuidv4(),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text(); // 에러 메시지 확인
    console.error("Failed to create todo:", response.status, errorText);
    return NextResponse.json(
      { error: "Failed to create todo" },
      { status: 500 }
    );
  }

  const newTodo = await response.json();
  console.log("Created newTodo:", newTodo); // 디버깅 로그
  return NextResponse.json(newTodo);
}

// PUT: Update a todo
export async function PUT(request: Request) {
  const todo = await request.json();

  const response = await fetch(`${API_URL}/${todo.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: `Failed to update todo ${todo.id}` },
      { status: 500 }
    );
  }

  const updatedTodo = await response.json();
  return NextResponse.json(updatedTodo);
}

// DELETE: Delete a todo
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: `Failed to delete todo ${id}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "Todo deleted successfully" });
}

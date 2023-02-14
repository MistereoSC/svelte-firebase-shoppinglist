import { error } from "@sveltejs/kit";
import { db } from "$lib/firebase.js";
import { collection, addDoc } from "firebase/firestore";

export async function POST({ params, request }) {
  const body = await request.json();
  const collectionRef = collection(
    db,
    "lists",
    params.listID,
    "subCollections",
    params.subListID,
    "items"
  );
  if (
    !body.name ||
    typeof body.name != "string" ||
    (typeof body.done != "undefined" && typeof body.done != "boolean")
  ) {
    return new Response(
      JSON.stringify({
        status: 400,
        message:
          "Item must be a JSON object with a 'name: string' field and optionally a 'done: boolean' field",
      })
    );
  }
  if (body.name.length < 3) {
    return new Response(
      JSON.stringify({
        status: 400,
        message: "Item name property must be at least 3 characters long",
      })
    );
  }

  const item = { name: body.name };
  item.done = typeof body.done == "boolean" ? body.done : false;
  const docRef = await addDoc(collectionRef, body);
  return new Response(
    JSON.stringify({
      status: 200,
      message: "OK",
      data: { ...item, id: docRef.id },
    })
  );
}

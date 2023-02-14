import { error } from "@sveltejs/kit";
import { db } from "$lib/firebase.js";
import { collection, getDocs } from "firebase/firestore";

//TODO: Remove
export async function GET({ url }) {
  let resp = [];
  const listsReference = collection(db, "lists");
  let lists = await getDocs(listsReference);
  lists.forEach((itm) => {
    resp.push({ ...itm.data(), id: itm.id });
  });

  return new Response(
    JSON.stringify({ status: 200, message: "OK", data: resp })
  );
}

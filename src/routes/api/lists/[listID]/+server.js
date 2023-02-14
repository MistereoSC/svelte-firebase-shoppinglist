import { error } from "@sveltejs/kit";
import { db } from "$lib/firebase.js";
import { collection, doc, getDocs, getDoc } from "firebase/firestore";

export async function GET({ params }) {
  //Get list
  let resp = {};
  const listReference = doc(db, "lists", params.listID);
  let list = await getDoc(listReference);
  resp = { ...list.data(), id: list.id, subCollections: [] };

  //TODO: Handle errors if List does not exist

  //Get sublists in list
  const subCollectionsRef = collection(listReference, "subCollections");
  let subCollections = await getDocs(subCollectionsRef);
  subCollections.forEach((itm) => {
    resp.subCollections.push({ ...itm.data(), id: itm.id, items: [] });
  });

  //Get items in sublists
  for (let idx = 0; idx < resp.subCollections.length; idx++) {
    const subListID = resp.subCollections[idx].id;

    const subListReference = collection(subCollectionsRef, subListID, "items");
    let subList = await getDocs(subListReference);
    subList.forEach((itm) => {
      resp.subCollections[idx].items.push({ ...itm.data(), id: itm.id });
    });
  }

  return new Response(
    JSON.stringify({ status: 200, message: "OK", data: resp })
  );
}

import { error } from "@sveltejs/kit";
import { db } from "$lib/firebase.js";
import { collection, getDocs } from "firebase/firestore";

export async function GET({ url }) {
  const colRef = collection(db, "items");
  let data = [];
  await getDocs(colRef)
    .then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        let itm = { ...doc.data(), id: doc.id };
        data.push(itm);
      });
    })
    .catch((err) => {
      console.log(err);
      throw error(400, "An error ocurred fetching data");
    });

  return new Response(JSON.stringify(data));
}

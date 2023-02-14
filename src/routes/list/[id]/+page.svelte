<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";

  let mainList = { title: ". . .", items: [] };
  let list = { title: "", subCollections: [] };
  let listID = "";

  onMount(async () => {
    listID = $page.params.id;
    const res = await fetch(`/api/lists/${listID}`);
    const t = await res.json();
    //TODO: handle error
    //if(t.status!==200){}
    list = t.data;
    mainList = list.subCollections.filter((c) => c.isMainList)[0];
  });

  async function checkItem(subListID, item) {
    const url = `/api/lists/${listID}/subCollections/${subListID}/items/${item.id}`;
    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
      },
      body: JSON.stringify({ done: !item.done }),
    });
    //ERROR HANDLING:
    //let t = await res.json();
    //if(t.status!==200) {}
  }
  async function deleteItem(subListID, itemID) {
    const url = `/api/lists/${listID}/subCollections/${subListID}/items/${itemID}`;
    const res = await fetch(url, {
      method: "DELETE",
    });
  }

  async function addItem(subListID, itemName) {
    const url = `/api/lists/${listID}/subCollections/${subListID}/items`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: JSON.stringify({ name: itemName }),
    });
    //ERROR HANDLING:
    //let t = await res.json();
    //if(t.status!==200) {}
  }
  async function createSubList(subListName) {}
  async function deleteSubList(subListID) {}
  async function renameSubList(subListID, newSubListName) {}
  async function deleteAllCheckedItems() {}
</script>

<div class="container">
  {#if list.title}
    <h1>{list.title}</h1>
  {/if}
  {#each list.subCollections as sublist}
    {#if !sublist.isMainList}
      <div class="sub-list">
        <h2>{sublist.title}</h2>
        {#each sublist.items as item}
          <div class="list-item">
            <input
              type="checkbox"
              bind:checked={item.done}
              on:click={checkItem(sublist.id, item)}
            />
            <p class:isDone={item.done == true}>{item.name}</p>
          </div>
        {:else}
          <p>No items yet . . .</p>
        {/each}
        <div class="add-button">
          <button><i class="material-icons">add</i></button>
        </div>
      </div>
    {/if}
  {:else}
    <p>loading . . .</p>
  {/each}

  <div class="sub-list">
    <h2>{mainList.title}</h2>
    {#each mainList.items as item, index}
      <div class="list-item">
        <input
          type="checkbox"
          bind:checked={item.done}
          on:click={checkItem(mainList.id, item)}
        />
        <p class:isDone={item.done == true}>{item.name}</p>
      </div>
    {:else}
      <p>No items yet . . .</p>
    {/each}
  </div>
</div>

<style lang="sass">
.container
  margin-top: 2rem
  width: 100vw
  display: flex
  flex-direction: column
  align-items: center

.sub-list
  background: #0005
  width: min(40ch, 90vw)
  margin: 0.5rem 0

  .list-item
    input
      display: inline
    p
      display: inline
    .isDone
      color: gray
      text-decoration: line-through 2px red


.add-button
  display: flex
  align-items: center
  button
    border-radius: 50%
    margin: auto
    cursor: pointer
</style>

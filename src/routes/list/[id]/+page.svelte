<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import AddItemModal from "$lib/components/AddItemModal.svelte";
  import RenameListModal from "$lib/components/RenameListModal.svelte";
  import AddListModal from "$lib/components/AddListModal.svelte";

  let list = { title: "", subCollections: [] };
  let listID = "";
  onMount(async () => {
    listID = $page.params.id;
    const res = await fetch(`/api/lists/${listID}`);
    const t = await res.json();
    //TODO: handle error
    //if(t.status!==200){}
    list = t.data;
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
  async function deleteItem(subListID, item, sublist) {
    const url = `/api/lists/${listID}/subCollections/${subListID}/items/${item.id}`;
    const res = await fetch(url, {
      method: "DELETE",
    });
    if (sublist) {
      sublist.items = sublist.items.filter((itm) => itm.name !== item.name);
    }
    list = list;
  }

  let addItemModalData = {
    subListName: "",
    subListID: "",
  };
  let addItemModalIsOpen = false;
  async function addItem(subListID, item) {
    const url = `/api/lists/${listID}/subCollections/${subListID}/items`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: JSON.stringify(item),
    });

    const newItem = await res.json();
    // ERROR HANDLING:
    // if(newItem.status!==200) {}

    const subColRef = list.subCollections.find((e) => e.id == subListID);
    subColRef.items.push(newItem.data);
    list = list;
  }

  let addListModalIsOpen = false;
  async function createSubList(item) {
    const url = `/api/lists/${listID}/subCollections`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: JSON.stringify(item),
    });

    const newList = await res.json();
    // ERROR HANDLING:
    // if(newList.status!==200) {}

    list.subCollections.push({ ...newList.data, items: [] });
    console.log(list.subCollections);
    list = list;
  }
  async function deleteSubList(subListID) {
    const url = `/api/lists/${listID}/subCollections/${subListID}`;
    const res = await fetch(url, {
      method: "DELETE",
    });

    list.subCollections = list.subCollections.filter(
      (itm) => itm.id !== subListID
    );
    list = list;
  }

  let renameListModalData = {
    subListName: "",
    subListID: "",
  };
  let renameListModalIsOpen = false;
  async function renameSubList(subListID, newSubListName) {
    const subColRef = list.subCollections.find((e) => e.id == subListID);
    subColRef.title = newSubListName;
    list = list;
    const url = `/api/lists/${listID}/subCollections/${subListID}`;
    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
      },
      body: JSON.stringify({ title: newSubListName }),
    });
  }

  async function deleteAllCheckedItems() {
    let itemsDeletionQueue = [];
    list.subCollections.forEach((sublist) => {
      const items = sublist.items.filter((itm) => itm.done);
      sublist.items = sublist.items.filter((itm) => !itm.done);
      itemsDeletionQueue.push({ subListID: sublist.id, items });
    });
    itemsDeletionQueue.forEach((sublist) => {
      sublist.items.forEach((item) => {
        deleteItem(sublist.subListID, item);
      });
    });
    list = list;
  }
</script>

<div class="container">
  <h1>{list.title}</h1>
  {#each list.subCollections as sublist}
    <div class="sub-list">
      <div class="sub-list-title">
        <h2>{sublist.title}</h2>
        <button
          class="list-rename-button"
          on:click={() => {
            renameListModalData = {
              subListName: sublist.title,
              subListID: sublist.id,
            };
            renameListModalIsOpen = true;
          }}
        >
          RENAME
        </button>
        {#if !sublist.isMainList}
          <button
            class="delete-list-button"
            on:click={() => {
              deleteSubList(sublist.id);
            }}
          >
            DEL</button
          >
        {/if}
      </div>
      {#each sublist.items as item}
        <div class="list-item">
          <input
            type="checkbox"
            bind:checked={item.done}
            on:click={checkItem(sublist.id, item)}
          />
          <p class:isDone={item.done == true}>{item.name}</p>
          <button
            class="delete-item-button"
            on:click={() => {
              deleteItem(sublist.id, item, sublist);
            }}
          >
            DEL</button
          >
        </div>
      {:else}
        <p>No items yet . . .</p>
      {/each}
      <div class="add-button">
        <button
          on:click={() => {
            addItemModalData = {
              subListName: sublist.title,
              subListID: sublist.id,
            };
            addItemModalIsOpen = true;
          }}
        >
          <i class="material-icons">add</i></button
        >
      </div>
    </div>
  {:else}
    <p>loading . . .</p>
  {/each}
  <button
    class="add-list-button"
    on:click={() => {
      addListModalIsOpen = true;
    }}
  >
    ADD LIST
  </button>
  <button
    class="delete-checked-button"
    on:click={() => {
      deleteAllCheckedItems();
    }}
  >
    DELETE ALL CHECKED ITEMS
  </button>
</div>

{#if addItemModalIsOpen}
  <AddItemModal
    value={addItemModalData}
    on:close={() => (addItemModalIsOpen = false)}
    on:itemAdded={(event) => {
      addItem(event.detail.subListID, event.detail.item);
      addItemModalIsOpen = false;
    }}
  />
{/if}
{#if renameListModalIsOpen}
  <RenameListModal
    value={renameListModalData}
    on:close={() => (renameListModalIsOpen = false)}
    on:rename={(event) => {
      renameSubList(event.detail.subListID, event.detail.data.title);
      renameListModalIsOpen = false;
    }}
  />
{/if}
{#if addListModalIsOpen}
  <AddListModal
    on:close={() => (addListModalIsOpen = false)}
    on:listAdded={(event) => {
      createSubList({ title: event.detail.data.title });
      addListModalIsOpen = false;
    }}
  />
{/if}

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

  .sub-list-title
    *
      display: inline
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

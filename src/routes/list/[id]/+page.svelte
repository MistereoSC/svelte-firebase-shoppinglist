<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import AddItemModal from "$lib/components/AddItemModal.svelte";
  import RenameListModal from "$lib/components/RenameListModal.svelte";

  let mainList;
  let list = { title: "", subCollections: [] };
  let listID = "";
  onMount(async () => {
    listID = $page.params.id;
    const res = await fetch(`/api/lists/${listID}`);
    const t = await res.json();
    //TODO: handle error
    //if(t.status!==200){}
    list = t.data;

    //sort list
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

    // ERROR HANDLING:
    // let t = await res.json();
    // if(t.status!==200) {}

    const subColRef = list.subCollections.find((e) => e.id == subListID);
    subColRef.items.push(item);
    list = list;
    mainList = list.subCollections.filter((c) => c.isMainList)[0];
  }

  async function createSubList(subListName) {}
  async function deleteSubList(subListID) {}

  let renameListModalData = {
    subListName: "",
    subListID: "",
  };
  let renameListModalIsOpen = false;
  async function renameSubList(subListID, newSubListName) {
    const subColRef = list.subCollections.find((e) => e.id == subListID);
    subColRef.title = newSubListName;
    list = list;
    mainList = list.subCollections.filter((c) => c.isMainList)[0];
    const url = `/api/lists/${listID}/subCollections/${subListID}`;
    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
      },
      body: JSON.stringify({ title: newSubListName }),
    });
  }

  async function deleteAllCheckedItems() {}
</script>

<div class="container">
  <h1>{list.title}</h1>
  {#each list.subCollections as sublist}
    {#if !sublist.isMainList}
      <div class="sub-list">
        <div class="sub-list-title">
          <h2>{sublist.title}</h2>
          <button class="list-rename-button">RENAME</button>
        </div>
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
    {/if}
  {:else}
    <p>loading . . .</p>
  {/each}

  {#if mainList}
    <div class="sub-list">
      <div class="sub-list-title">
        <h2>{mainList.title}</h2>
        <button
          class="list-rename-button"
          on:click={() => {
            renameListModalData = {
              subListName: mainList.title,
              subListID: mainList.id,
            };
            renameListModalIsOpen = true;
          }}
        >
          RENAME
        </button>
      </div>
      {#each mainList.items as item}
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
      <div class="add-button">
        <button
          on:click={() => {
            addItemModalData = {
              subListName: mainList.title,
              subListID: mainList.id,
            };
            addItemModalIsOpen = true;
          }}
        >
          <i class="material-icons">add</i></button
        >
      </div>
    </div>
  {/if}
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

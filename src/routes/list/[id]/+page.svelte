<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import ListModal from "../../../lib/components/ListModal.svelte";

  let list = { title: "", subCollections: [] };
  let listID = "";
  let modalIsOpen = false;
  let modalData = {
    title: "",
    inputPlaceholder: " . . . ",
  };
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

  async function renameMainList(newListName) {
    const url = `/api/lists/${listID}`;
    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
      },
      body: JSON.stringify({ title: newListName }),
    });
    list.title = newListName;
    list = list;
  }
</script>

{#if listID.length > 0}
  <div class="container">
    <div class="title-container">
      <h1>{list.title}</h1>
      <button
        class="button-rename"
        on:click={() => {
          modalData = {
            title: `Rename '${list.title}' to...`,
            inputPlaceholder: list.title,
            okFunction: (e) => {
              renameMainList(e.detail);
            },
          };
          modalIsOpen = true;
        }}><i class="material-icons">edit</i></button
      >
    </div>

    {#each list.subCollections as sublist}
      <div class="sub-list-container">
        <div class="sub-list-title">
          <div class="sub-list-title-left">
            <h2>{sublist.title}</h2>
            <button
              class="button-rename"
              on:click={() => {
                modalData = {
                  title: `Rename '${sublist.title}' to...`,
                  inputPlaceholder: sublist.title,
                  okFunction: (e) => {
                    renameSubList(sublist.id, e.detail);
                  },
                };
                modalIsOpen = true;
              }}
            >
              <i class="material-icons">edit</i>
            </button>
          </div>
          {#if !sublist.isMainList}
            <button
              class="button-delete-list"
              on:click={() => {
                deleteSubList(sublist.id);
              }}
            >
              <i class="material-icons">delete</i>
            </button>
          {/if}
        </div>
        {#each sublist.items as item}
          <div class="list-item">
            <div class="list-item-left">
              <input
                type="checkbox"
                bind:checked={item.done}
                on:click={checkItem(sublist.id, item)}
              />
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <p
                class:isDone={item.done == true}
                on:click={() => {
                  item.done = !item.done;
                  list = list;
                }}
              >
                {item.name}
              </p>
            </div>
            <button
              class="button-delete-item"
              on:click={() => {
                deleteItem(sublist.id, item, sublist);
              }}
            >
              <i class="material-icons">close</i>
            </button>
          </div>
        {:else}
          <p>No items yet . . .</p>
        {/each}
        <div class="button-add-container">
          <button
            on:click={() => {
              modalData = {
                title: `Add item to '${sublist.title}'`,
                inputPlaceholder: "I need to buy ...",
                okFunction: (e) => {
                  addItem(sublist.id, { name: e.detail, done: false });
                },
              };
              modalIsOpen = true;
            }}
          >
            <i class="material-icons">add</i>
          </button>
        </div>
      </div>
    {/each}
    <button
      class="button-add-list"
      on:click={() => {
        modalData = {
          title: `Create new List`,
          inputPlaceholder: "Home Depot...",
          okFunction: (e) => {
            createSubList({ title: e.detail });
          },
        };
        modalIsOpen = true;
      }}
    >
      <i class="material-icons">add</i>
      <p>New List</p>
    </button>
    <button
      class="button-delete-checked"
      on:click={() => {
        deleteAllCheckedItems();
      }}
    >
      <i class="material-icons">delete</i>
      <p>Delete checked items</p>
    </button>
  </div>
{:else}
  <div class="loading-container">
    <h1>LOADING . . .</h1>
  </div>
{/if}

{#if modalIsOpen}
  <ListModal
    title={modalData.title}
    inputPlaceholder={modalData.inputPlaceholder}
    on:ok={(e) => {
      modalData.okFunction(e);
      modalIsOpen = false;
    }}
    on:close={() => {
      modalIsOpen = false;
    }}
  />
{/if}

<style lang="sass">
button
  cursor: pointer
.container
  margin: 2rem 0
  width: 100vw
  display: flex
  flex-direction: column
  align-items: center

.sub-list-container
  background: colors.$background-sub
  width: min(40ch, 90vw)
  margin: 0.5rem 0
  padding: 1rem 1rem 0 1rem


  .sub-list-title
    display: flex
    flex-direction: row
    justify-content: space-between
    h2
      font-size: 2.5rem

    .sub-list-title-left
      *
        display: inline


  .list-item
    display: flex
    flex-direction: row
    justify-content: space-between
    margin: 0.5rem 0
    .list-item-left
      display: flex
      flex-direction: row

    p
      cursor: pointer
      font-size: 1.5rem
      margin: 0 0.5rem
      transition: color 0.3s
      &::after
        content: ""
        height: 2px
        width: 0%
        position: absolute
        top: 50%
        left: 0
        background: colors.$text-accent
        animation: underline-animation-reverse 0.3s

    p.isDone
      color: colors.$text-mute
      &::after
        width: 100%
        animation: underline-animation 0.3s

    input
      cursor: pointer
      border: none

.button-add-container
  display: flex
  justify-content: center
  button
    width: 2.5rem
    height: 2.5rem
    border: none
    border-radius: 50%
    margin: 0.5rem 0
    background: colors.$button-background
    color: colors.$button-text
    transition: background, color, 0.3s
    i 
      font-size: 2rem
      font-weight: bold
    
    &:hover
      background: colors.$button-background-hover
      color: colors.$button-text-hover

.title-container
  .button-rename i
    font-size: 2rem
  h1
    font-size: 3.5rem
    display: inline
  
.button-rename
  background: transparent
  color: colors.$text-mute
  border: none
  margin-left: 0.75rem
  i 
    font-size: 1.5rem
    vertical-align: bottom

.button-delete-item
  justify-self: end
  background: transparent
  border: none
  margin-right: 0.75rem
  i
    font-size: 1.5rem
    color: colors.$text-mute
    vertical-align: bottom



.button-delete-list
  background: transparent
  color: colors.$notice-error
  border: none
  i
    font-size: 1.5rem
    margin: -0.5rem -0.5rem 0 0

.button-delete-checked,
.button-add-list
  background: colors.$button-background
  color: colors.$button-text

  border: none
  border-radius: 4px
  margin: 0.5rem 0
  font-size: 1rem
  display: flex
  flex-direction: row
  width: 30ch
  padding: 0.1rem 0.5rem
  
  p
    font-size: 1.4rem

.loading-container
  width: 100vw
  height: 20vh
  display: flex
  justify-content: center
  align-items: center

h2:has(+ .button-rename:hover),
h1:has(+ .button-rename:hover)
  &::after
    content: ""
    height: 2px
    width: 100%
    position: absolute
    bottom: 5px
    left: 0

    background: colors.$text-accent
    animation: underline-animation 0.3s

.list-item-left:has(+ .button-delete-item:hover)
  &::before
    content: ""
    height: 100%
    width: 100%
    position: absolute
    top: 0
    left: 0

    background: colors.$text-accent
    animation: underline-animation 0.3s

  
@keyframes underline-animation
  from 
    width: 0%
  to 
    width: 100%

@keyframes underline-animation-reverse
  from 
    width: 100%
  to 
    width: 0%

</style>

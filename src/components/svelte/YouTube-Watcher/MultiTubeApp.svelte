<script>
  import VideoCard from "./ui/VideoCard.svelte";

  export let videoListParams = "";

  // App State
  let userLinks;
  let error;
  let vidJsonArr = [];
  let vidCount = 0;
  let hideInput = false;
  let invalidCount = 0;
  let activeVideo;
  let activeTitle;
  let shareLinkPopup = false;
  let shareLinkValue;
  let copiedOutput = false;

  $: {
    vidCount = vidJsonArr.length;
  }

  //Functions

  async function getVidJson(url) {
    try {
      const response = await fetch("https://www.youtube.com/oembed?url=" + url);
      const contentType = response.headers.get("content-type");

      if (contentType.includes("application/json")) {
        const youtubeJson = await response.json();
        vidJsonArr = [youtubeJson, ...vidJsonArr];
      } else {
        invalidCount++;
      }
    } catch (error) {
      console.log(error);
      invalidCount++;
    }
  }

  function generateList() {
    vidJsonArr = [];
    if (userLinks) {
      error = "";
      let linksArr = userLinks
        .split(/[,\s\n]/g)
        .filter((link) => link.trim().length > 0);

      for (let i = 0; i < linksArr.length; i++) {
        getVidJson(linksArr[i]);
      }

      hideInput = true;
    } else {
      error = "Input cannot be empty!";
    }
  }

  function selectVideo(event) {
    activeTitle = event.detail.videoTitle;
    activeVideo = event.detail.videoCode.replace(
      /.*src="([\w:\/\.\?\=-]+)".*/,
      "$1"
    );
    console.log("Selected Video: ", activeVideo);
  }

  function editListHandler() {
    hideInput = false;
  }

  function shareLinkHandler() {
    let pageUrl = window.location.href;
    let cleanPageUrl = pageUrl.slice(0, pageUrl.indexOf("?"));
    shareLinkValue = "";
    shareLinkValue =
      cleanPageUrl + "?videoList=" + encodeURIComponent(userLinks);
    shareLinkPopup = true;
    console.log(shareLinkValue);
  }

  function closeShareHandler() {
    shareLinkPopup = false;
  }

  function copyShareLink() {
    var range = document.createRange();
    range.selectNode(document.getElementById("shareLink"));
    window.getSelection().removeAllRanges(); // clear current selection
    window.getSelection().addRange(range); // to select text
    document.execCommand("copy");
    window.getSelection().removeAllRanges(); // to deselect
    copiedOutput = true;
  }

  function resetApp() {
    window.location.href = "/svelte/multitube";
  }

  function urlParamChecker() {
    if (videoListParams) {
      try {
        userLinks = decodeURIComponent(videoListParams);
        generateList();
      } catch (error) {
        console.log(error);
        resetApp();
      }
    }
  }

  urlParamChecker();
</script>

<div class="multitube">
  <h1>MultiTube Viewer</h1>
  {#if !hideInput}
    <h2>Instructions</h2>
    <p>
      Paste in multiple Youtube URLs, then generate playlist. They must be
      separated by a space, comma, or new line.
    </p>
    <div class="user-input">
      <form on:submit|preventDefault={generateList}>
        <div class="input-container">
          <textarea
            name="Youtube-Links"
            bind:value={userLinks}
            cols="100"
            rows="5"
          ></textarea>
          {#if error}
            <div class="error">Error: {error}</div>
          {/if}
        </div>
        <button class="generate-list"
          ><i class="fa-solid fa-list"></i> Generate List</button
        >
      </form>
    </div>
  {:else}
    <div class="video-options">
      <button class="video-options--edit" on:click={editListHandler}
        >Edit Video List</button
      >
      <button class="video-options--share" on:click={shareLinkHandler}
        >Share List</button
      >
      <button class="video-options--reset" on:click={resetApp}
        >Start Fresh</button
      >
    </div>
  {/if}

  {#if activeVideo && hideInput}
    <h2>{activeTitle}</h2>
    <div class="activevideo-container">
      <iframe
        src={activeVideo}
        title={activeTitle}
        frameborder="0"
        allowfullscreen
      ></iframe>
    </div>
  {/if}

  {#if vidJsonArr.length > 0 && hideInput}
    {#if invalidCount > 0}
      <div class="invalid-count">
        Unable to process {invalidCount}
        {invalidCount > 1 ? "videos" : "video"}, so {invalidCount > 1
          ? "they were"
          : "it was"} excluded.
      </div>
    {/if}
    <div class="results">
      <h3>Video List - {vidCount}</h3>
      <div class="results--list">
        {#each vidJsonArr as vid}
          <VideoCard {vid} on:videoSelection={selectVideo} />
        {/each}
      </div>
    </div>
  {/if}

  {#if shareLinkPopup}
    <div class="shareLink-container">
      <div class="inner-dialog">
        <h3>Share Link</h3>
        <div class="link">
          {#if copiedOutput}
            <div class="copied-output">Link Copied!</div>
          {/if}
          <input
            id="shareLink"
            type="text"
            readonly
            bind:value={shareLinkValue}
          />
          <div class="share-options">
            <button on:click={copyShareLink}>Copy</button>
            <button on:click={closeShareHandler}>Close</button>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  .error {
    display: block;
    color: rgba(247, 32, 32, 0.753);
    font-weight: bold;
    padding: 15px 0;
  }

  .input-container {
    textarea {
      max-width: 100%;
      font-size: 16px;
    }
  }

  button.generate-list {
    background-color: var(--secondary-color);
    color: white;
    border-radius: 20px;
    border: none;
    padding: 10px;
    margin-top: 10px;
    cursor: pointer;
    font-weight: bold;

    @media (max-width: 766px) {
      width: 100%;
    }
  }

  .activevideo-container {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 56%;
    margin-bottom: 50px;

    > iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }

  .results--list {
    display: grid;
    grid-template-columns: auto auto auto auto;
    gap: 15px;

    @media (max-width: 767px) {
      grid-template-columns: auto auto;
    }
  }

  .video-options {
    display: flex;
    gap: 10px;
    width: 100%;

    button {
      background-color: var(--tertiary-color);
      border: none;
      border-radius: 10px;
      padding: 10px;
      cursor: pointer;
      font-size: 15px;

      &:hover {
        background-color: var(--secondary-color);
        color: white;
      }

      &.video-options--reset {
        align-self: flex-end;
        background-color: var(--secondary-color);
        color: white;

        &:hover {
          background-color: var(--tertiary-color);
          color: #0e141b;
        }
      }
    }
  }

  .shareLink-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    background-color: rgba(14, 20, 27, 0.7);

    .inner-dialog {
      text-align: center;
      background-color: var(--secondary-color);
      padding: 15px;
      border-radius: 15px;
      max-width: 500px;
      width: 100%;

      .copied-output {
        margin-bottom: 10px;
      }

      input {
        width: 100%;
        font-size: 16px;
        padding: 5px;
        border: none;
        border-radius: 5px;
      }
    }

    .share-options {
      display: grid;
      gap: 5px;
      margin-top: 15px;
      button {
        background-color: var(--tertiary-color);
        border: none;
        padding: 10px 20px;
        font-weight: bold;
        transition: all 0.15s ease-in-out;
        cursor: pointer;

        &:hover {
          background-color: var(--primary-background);
          color: white;
        }
      }
    }
  }
</style>

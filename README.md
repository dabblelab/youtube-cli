youtube-cli
================

Manage youtube data through CLI

<!-- toc -->
* [Requirements](#requirements)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Requirements

## Turn on the YouTube Data api
Walk through the steps in [Turn on the YouTube Data api here.](https://developers.google.com/youtube/v3/quickstart/nodejs#step_1_turn_on_the)

# Usage

```sh-session
USAGE
  $ youtube
...
```

# Commands

<!-- commands -->

_Init_

* [`youtube init:profile`](#youtube-initprofile)
* [`youtube init:airtable`](#youtube-initairtable)

_Playlist And Items_

* [`youtube playlist:list`](#youtube-playlistlist)
* [`youtube playlist:items:delete`](#youtube-playlistitemsdelete)
* [`youtube playlist:items:export`](#youtube-playlistitemsexport)
* [`youtube playlist:items:update`](#youtube-playlistitemsupdate)
* [`youtube playlist:items:upload`](#youtube-playlistitemsupload)


# Usage

## `youtube init:profile`

Create YouTube profile

```
USAGE
  $ youtube init:profile

OPTIONS
  -n, --name=name  name of the profile
```

_See code: [src/commands/init/profile.js](https://github.com/Mohammad-Khalid/youtube-cli/blob/v0.0.1-beta.1/src/commands/init/profile.js)_

## `youtube init:airtable`

Update profile with Airtable credential

```
USAGE
  $ youtube init:airtable

OPTIONS
  -n, --name=name  name of the profile
```

_See code: [src/commands/init/airtable.js](https://github.com/Mohammad-Khalid/youtube-cli/blob/v0.0.1-beta.1/src/commands/init/airtable.js)_

## `youtube playlist:list`

List of all playlist

```
USAGE
  $ youtube playlist:list

OPTIONS
  -p, --profile=profile  [default: default] Name of profile that associated YouTube Data API credential
```

_See code: [src/commands/playlist/list.js](https://github.com/Mohammad-Khalid/youtube-cli/blob/v0.0.1-beta.1/src/commands/playlist/list.js)_

## `youtube playlist:items:delete`

Delete item from playlist

```
USAGE
  $ youtube playlist:items:delete

OPTIONS
  -p, --profile=profile  [default: default] Name of profile that associated YouTube Data API credential
  --playlist=playlist    (required) Playlist ID from which item to be deleted
```

_See code: [src/commands/playlist/items/delete.js](https://github.com/Mohammad-Khalid/youtube-cli/blob/v0.0.1-beta.1/src/commands/playlist/items/delete.js)_

## `youtube playlist:items:export`

Export all playlists items

```
USAGE
  $ youtube playlist:items:export

OPTIONS
  -p, --profile=profile  [default: default] Name of profile that associated YouTube Data API credential
  -s, --source=source    [default: file] Export playlist items to file or airtable(file|airtable)
  --playlist=playlist    [default: all] Playlist Id (id | all)
```

_See code: [src/commands/playlist/items/export.js](https://github.com/Mohammad-Khalid/youtube-cli/blob/v0.0.1-beta.1/src/commands/playlist/items/export.js)_

## `youtube playlist:items:update`

Update all playlists items

```
USAGE
  $ youtube playlist:items:update

OPTIONS
  -p, --profile=profile      [default: default] Name of profile that associated YouTube Data API credential
  -s, --source=source        (required) Export playlist items from file or airtable(<file path>|airtable)
  -t, --thumbnail=thumbnail  Video thumbnail(<thumbnail-file-path>)
```

_See code: [src/commands/playlist/items/update.js](https://github.com/Mohammad-Khalid/youtube-cli/blob/v0.0.1-beta.1/src/commands/playlist/items/update.js)_

## `youtube playlist:items:upload`

Upload item into playlist

```
USAGE
  $ youtube playlist:items:upload

OPTIONS
  -m, --media=media          (required) Playlist items media/video path <media-file-path>
  -p, --profile=profile      [default: default] Name of profile that associated YouTube Data API credential
  -s, --schema=schema        (required) Playlist items schema path <schema-file-path>
  -t, --thumbnail=thumbnail  Video thumbnail(<thumbnail-file-path>)
  --playlist=playlist        (required) Playlist ID to which item to be uploaded
```

_See code: [src/commands/playlist/items/upload.js](https://github.com/Mohammad-Khalid/youtube-cli/blob/v0.0.1-beta.1/src/commands/playlist/items/upload.js)_
<!-- commandsstop -->
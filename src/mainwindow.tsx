import { createState } from "gnim"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import { readFile, writeFile } from "ags/file"
import GLib from "gi://GLib"

import { NoteManager, Grid } from "@/structures"
import { NoteView } from "@/notelist/noteview"
import { TopBar } from "@/topbar/topbar"


function CheckForJSON() {
  const dir = GLib.build_filenamev([GLib.get_user_config_dir(), "TodoWidget"])
  GLib.mkdir_with_parents(dir, 0o755)
  const notesPath = GLib.build_filenamev([dir, "data/notes.conf"])

  try{
    const data = readFile(notesPath)
    console.log("File data", data)
    return data
  }
  catch(error){
    console.log("Error reading notes file:", error)
    console.log("Creating empty notes file")
    writeFile(notesPath, "[]")
    console.log("Notes file created")
    return "[]"
  }
  
}

export function MainWindow(_monitor : Gdk.Monitor){
  const WIN_H = 250
  const WIN_W = 250


  const { width, height } = _monitor.geometry

  // Anchored top-right, that means:
  const marginRight = Math.round(width / 4 - WIN_W / 2)
  const marginTop = Math.round(height / 4 - WIN_H / 2)

  // TODO: Load notes from JSON
  const previousNoteData = CheckForJSON() 
  NoteManager.init(previousNoteData)

  const [addingNewNote, setAddingNewNote] = createState(false)

  const noteView = NoteView(addingNewNote, setAddingNewNote)
  const topBar = TopBar(setAddingNewNote)
  
  return(
  <window name="ToDo List"
          gdkmonitor={_monitor}
          cssClasses={["todo"]}
          layer={Astal.Layer.BOTTOM}
          anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
          exclusivity={Astal.Exclusivity.IGNORE}
          marginTop={marginTop}
          marginRight={marginRight}
          keymode={addingNewNote((a) => (a ? Astal.Keymode.ON_DEMAND : Astal.Keymode.NONE))}
          visible
    >
    <Grid rowSpacing={2} columnSpacing={1}
          marginStart={16} marginEnd={16}
      $={(self) => {
          self.attach(topBar as Gtk.Widget, 0, 0, 1, 1)
          self.attach(noteView as Gtk.Widget, 0, 1, 1, 1)
        }
        }
    />
  </window>
  )
}
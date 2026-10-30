import { createState } from "gnim"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import { readFile, writeFile } from "ags/file"
import GLib from "gi://GLib"

import { NoteManager, Grid } from "@/structures"
import { NoteView } from "@/notelist/noteview"
import { TopBar } from "@/topbar/topbar"

const EDGE_PADDING = 16

function FitWindow(_win: Astal.Window, _desiredLeft: number, _screenWidth: number) {
  // let the window shrink back to its natural size first (previous step)
  _win.set_default_size(-1, -1)

  // natural width the window wants right now
  const [, natural] = _win.measure(Gtk.Orientation.HORIZONTAL, -1)

  // furthest left margin that still keeps the whole window on screen
  const maxLeft = _screenWidth - natural - EDGE_PADDING

  _win.marginLeft = Math.max(0, Math.min(_desiredLeft, maxLeft))
}

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
  const marginLeft = Math.round((width * 3) / 4 - WIN_W / 2)
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
          anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT}
          exclusivity={Astal.Exclusivity.IGNORE}
          marginTop={marginTop}
          marginLeft={marginLeft}
          keymode={addingNewNote((a) => (a ? Astal.Keymode.ON_DEMAND : Astal.Keymode.NONE))}
          visible
          $={(self) => {
            const refit = () => {
              GLib.idle_add(GLib.PRIORITY_LOW, () => {
                FitWindow(self as Astal.Window, marginLeft, width)
                return GLib.SOURCE_REMOVE
              })
            }
            
            NoteManager.get().notes.subscribe(refit)
            refit()
          }}
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
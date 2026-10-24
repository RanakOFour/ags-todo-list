import { createState } from "gnim"
import { Astal, Gtk, Gdk } from "ags/gtk4"

import { NoteManager, Grid } from "@/structures"
import { NoteView } from "@/notelist/noteview"
import { TopBar } from "@/topbar/topbar"

export function MainWindow(){
  const WIN_H = 250
  const WIN_W = 250
  // First monitor size
  const monitor = Gdk.Display.get_default()!.get_monitors().get_item(0) as Gdk.Monitor
  const { width, height } = monitor.get_geometry()

  // Anchored top-right, that means:
  const marginRight = Math.round(width / 4 - WIN_W / 2)
  const marginTop = Math.round(height / 4 - WIN_H / 2)

  // TODO: Load notes from JSON
  NoteManager.init()

  const [addingNewNote, setAddingNewNote] = createState(false)

  const noteView = NoteView(addingNewNote, setAddingNewNote)
  const topBar = TopBar(setAddingNewNote)
  
  return(
  <window visible name="ToDo List"
          anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
          exclusivity={Astal.Exclusivity.IGNORE}
          marginTop={marginTop}
          marginRight={marginRight}
          keymode={Astal.Keymode.ON_DEMAND}
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
import { Note, NoteManager, CheckButton, Entry } from "@/structures"
import { createState, For } from "ags"
import { Gtk } from "ags/gtk4"
import GObject from "gnim/gobject"

export function NoteItem({note} : {note : Note}){
  const [complete, setComplete] = createState(note.isCompleted)

  return(
    <CheckButton
      name={`note-${note.id}`}
      label={note.text}
      active={complete}
      cssClasses={complete((c) => (c ? ["note", "completed"] : ["note"]))}
      onToggled={({active}) => {
        note.isCompleted = active
        setComplete(active)
      }}
    />
  )
}

export function NoteView() : GObject.Object {
  
  const nm = NoteManager.get()

  // TEST
  nm.AddNote("Test")
  nm.AddNote("Test2")

  return(
    // Add button for each note
    <box orientation={Gtk.Orientation.VERTICAL}>
      {nm.notes().map((note) => <NoteItem note={note}/>)}
    </box>
  )
}
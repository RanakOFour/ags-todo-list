import { Accessor, createState, For } from "ags"
import { Gtk } from "ags/gtk4"

import { Note, NoteManager, CheckButton } from "@/structures"

// Sits hidden at the bottom of the NoteView until
// the "+" button in TopBar is pressed
export let NewNoteEntry : Gtk.Entry

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

export function NoteView(addingNewNote : Accessor<boolean>, setAddingNewNote : (v : boolean) => void) {
  const nm = NoteManager.get()

  return(
    // Add button for each note
    <box orientation={Gtk.Orientation.VERTICAL}>
      <box orientation={Gtk.Orientation.VERTICAL}>
        <For each={nm.notes}>
          {(note) => <NoteItem note={note}/>}
        </For>
      </box>
    <entry // This is the NewNoteEntry
      $={(self) => (NewNoteEntry = self)}
      cssClasses={["newnote"]} 
      placeholderText={"New note"}
      visible={addingNewNote}
      onActivate={(self) => {
        const text = self.text.trim()
        if (text != "") nm.AddNote(text)
        self.text = ""
        setAddingNewNote(false)
      }}
    />
    </box>
  )
}
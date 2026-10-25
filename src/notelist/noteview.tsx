import { Accessor, createState, For } from "ags"
import { Gtk } from "ags/gtk4"

import { Note, NoteManager, CheckButton } from "@/structures"

// Sits hidden at the bottom of the NoteView until
// the "+" button in TopBar is pressed
export let NewNoteEntry : Gtk.Entry

export function NoteItem({note} : {note : Note}){
  const [complete, setComplete] = createState(note.isCompleted)
  const nm = NoteManager.get()

  complete.subscribe(() => {nm.WriteNotesToConfig()})

  const deleteButton = (
  <button
    cssClasses={["deletenote"]}
    visible={complete}
    label={"X"}
    onClicked={() => {NoteManager.get().RemoveNote(note)}}
    halign={Gtk.Align.END}
    />) as Gtk.Widget
    
    return(
    <overlay
      cssClasses={complete((c) => (c ? ["note", "completed"] : ["note"]))}
      name={`note-${note.id}`}
      $={(self) => self.add_overlay(deleteButton)}
    >
    <CheckButton
     label={note.text}
      active={complete}
      cssClasses={complete((c) => (c ? ["notetext", "completed"] : ["notetext"]))}
      onToggled={({active}) => {
        note.isCompleted = active
        setComplete(active)
      }}
    />
    
    </overlay>
  )
}

export function NoteView(_addingNewNote : Accessor<boolean>, _setAddingNewNote : (v : boolean) => void) {
  const nm = NoteManager.get()

  return(
    // Add button for each note
    <box orientation={Gtk.Orientation.VERTICAL}>
      {
        // Second box to display Entry below the list
      }
      <box orientation={Gtk.Orientation.VERTICAL} spacing={2}>
        <For each={nm.notes}>
          {(note, nm) => <NoteItem note={note}/>}
        </For>
      </box>
    <entry // This is the NewNoteEntry
      $={(self) => (NewNoteEntry = self)}
      cssClasses={["newnote"]} 
      placeholderText={"New note"}
      visible={_addingNewNote}
      onActivate={(self) => {
        const text = self.text.trim()
        if (text != "") nm.AddNote(text)
        self.text = ""
        _setAddingNewNote(false)
      }}
    />
    </box>
  )
}
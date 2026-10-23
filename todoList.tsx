#!/usr/bin/env -S ags run
import style from "./style.scss"
import app from "ags/gtk4/app"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import { CCProps, jsx, createState } from "ags"
import { createPoll } from "ags/time"

// Other GTK elements converted into jsx
const CheckButton = (props: Partial<CCProps<Gtk.CheckButton, Gtk.CheckButton.ConstructorProps>>) =>
  jsx(Gtk.CheckButton, props)

const TextTag = (props: Partial<CCProps<Gtk.TextTag, Gtk.TextTag.ConstructorProps>>) =>
  jsx(Gtk.TextTag, props)

const Grid = (props: Partial<CCProps<Gtk.Grid, Gtk.Grid.ConstructorProps>>) =>
  jsx(Gtk.Grid, props)

// Note, Tag and Manager classes
class Note
{
  id : number = -1
  text : string = ""
  cmdToStart : string = ""
  isCompleted : boolean = false
  deadline : Date = new Date()
  dateCreated : Date = new Date()
}

function NoteItem({note} : {note : Note}){
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

class Tag
{
  name : string = ""
  color : string = ""
  notes : number[]
}

class NoteManager
{
  notes : Note[]
  tags : Tag[]

  constructor(){
    this.notes = new Array<Note>()
    this.tags = new Array<Tag>()
  }

  AddNote(_text : string) : Note {
    var newNote = new Note()
    
    newNote.id = this.notes.length
    newNote.text = _text
    newNote.dateCreated = new Date()
    
    this.notes.push(newNote)
    
    return newNote
  }
 
  SetDeadline(_id : number, _deadline : Date) {
    const found = this.notes.find((note) => note.id == _id)
    if(found) {
      found.deadline = _deadline
    }
  }

  SetCommand(_id : number, _cmd : string) {
    const found = this.notes.find((note) => note.id == _id)
    if(found) {
      found.cmdToStart = _cmd
    }
  }
}

function AddNoteButton(){
  return (
    <button label="+" onClicked={printAfterSay}/>
  )
}

function NoteView(_noteManager : NoteManager){
  
  // TEST
  _noteManager.AddNote("Test")
  _noteManager.AddNote("Test2")

  return(
    // Add button for each note
    <box orientation={Gtk.Orientation.VERTICAL}>
      {_noteManager.notes.map((note) => <NoteItem note={note}/>)}
    </box>
  )
}

function TopBar(_noteView : Gtk.Box, _noteManager : NoteManager){
  return(
    <box orientation={Gtk.Orientation.HORIZONTAL} spacing={4}>
      <label label="To Do" xalign={0} hexpand />
      <button css="min-width: 0; min-height: 0; padding: 2px 8px;" label="+" onClicked={() => print("add")} />
      <button css="min-width: 0; min-height: 0; padding: 2px 8px;" label="F" />
      <button css="min-width: 0; min-height: 0; padding: 2px 8px;" label="S" />
    </box>
  )
}

function MainWindow(){
  const WIN_H = 250
  const WIN_W = 250
  // First monitor size
  const monitor = Gdk.Display.get_default()!.get_monitors().get_item(0) as Gdk.Monitor
  const { width, height } = monitor.get_geometry()

  // Anchored top-right, that means:
  const marginRight = Math.round(width / 4 - WIN_W / 2)
  const marginTop = Math.round(height / 4 - WIN_H / 2)

  // TODO: Load notes from JSON
  var noteManager = new NoteManager()

  const noteView = NoteView(noteManager)
  const topBar = TopBar(noteView, noteManager)
  
  return(
  <window css="border-radius: 8%; min-width: 250px; min-height: 250px;"
          visible name="ToDo List"
          anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
          exclusivity={Astal.Exclusivity.IGNORE}
          marginTop={marginTop}
          marginRight={marginRight}
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

app.start({
  css: style,
  main() {
    return MainWindow()
  },
})

#!/usr/bin/env -S ags run
import style from "./style.scss"
import app from "ags/gtk4/app"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import { CCProps, jsx} from "ags"
import { createPoll } from "ags/time"

const CheckButton = (props: Partial<CCProps<Gtk.CheckButton, Gtk.CheckButton.ConstructorProps>>) =>
  jsx(Gtk.CheckButton, props)

const Grid = (props: Partial<CCProps<Gtk.Grid, Gtk.Grid.ConstructorProps>>) =>
  jsx(Gtk.Grid, props)

class Note
{
  name : string
  content : string
}

function AddNoteButton(){
  return (
    <button label="+" onClicked={printAfterSay}/>
  )
}

function NoteView(){
  return(
    // Add button for each note
    <box orientation={Gtk.Orientation.VERTICAL}>
      <label label="Test"/>
      <label label="Test2"/>
    </box>
  )
}

function TopBar(){
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
          self.attach(TopBar() as Gtk.Widget, 0, 0, 1, 1)
          self.attach(NoteView() as Gtk.Widget, 0, 1, 1, 1)
        }
        }
    />
  </window>
  )
}

function oldMainWindow(){
return (<window css="min-width: 250px; min-height: 250px; border: 1px solid red; border-radius: 8%;" visible name="TestWindow">
        <Grid 
          rowSpacing={3} columnSpacing={1}

          // Maybe add empty boxes instead so the CheckButtons can span the whole window width
          marginStart={16} marginEnd={16}
          $={(self) => {
            self.attach(<label label="To Do" xalign={0}/> as Gtk.Widget, 1, 0, 1, 1)
            self.attach(<CheckButton label="This is a button" /> as Gtk.Widget, 1, 1, 1, 4)
            self.attach(<AddNoteButton/> as Gtk.Widget, 1, 2, 1, 1)
          }}
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

#!/usr/bin/env -S ags run
import app from "ags/gtk4/app"
import style from "./style.scss"
import GLib from "gi://GLib"

import { MainWindow } from "@/mainwindow"
import { readFile } from "ags/file"

function CheckForCSSStyle() {
  const path = GLib.build_filenamev([GLib.get_user_config_dir(), "TodoWidget/style.scss"])
  try
  {
    const data = readFile(path)
    console.log("Found style at", path)
    return data
  }
  catch
  {
    console.log("No style.scss found")
    return ""
  }
}

app.start({
  css: style,
  main() {
    const cssData = CheckForCSSStyle()
    if(cssData != "") {
      this.css = cssData
    }

    return MainWindow()
  },
})
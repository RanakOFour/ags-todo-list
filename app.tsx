#!/usr/bin/env -S ags run
import app from "ags/gtk4/app"
import style from "./style.scss"

import { MainWindow } from "@/mainwindow"

app.start({
  css: style,
  main() {
    return MainWindow()
  },
})

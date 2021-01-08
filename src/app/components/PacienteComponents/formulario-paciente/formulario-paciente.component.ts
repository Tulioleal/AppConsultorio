import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms'
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

//SERVICE
import { PacienteService } from 'src/app/services/paciente.service';

@Component({
  selector: 'app-formulario-paciente',
  templateUrl: './formulario-paciente.component.html',
  styleUrls: ['./formulario-paciente.component.scss']
})
export class FormularioPacienteComponent implements OnInit {

  constructor(
    public pacienteService: PacienteService,
    private snackbar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  addPaciente(form: NgForm) {
    this.pacienteService.createPaciente(form.value).subscribe(
      res => {
        console.log(res)
        this.openSnackBar()
        this.router.navigate(['/pacientes/especific'])
      },
      err => {
        console.log(err)
        this.pacienteService.error()
      }
    )
  }

  private openSnackBar() {
    this.snackbar.open('Paciente Created', 'Cerrar', {
      duration: 3000
    })
  }
}

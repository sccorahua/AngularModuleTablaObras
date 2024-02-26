import { AfterViewInit, Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthScheme } from 'aws-sdk/clients/rds';
import { Obra } from 'src/app/models/obra';
import { AuthService } from 'src/app/pages/authentication/login/auth.service';
import { ObraService } from 'src/app/services/obra.service';
import Swal from 'sweetalert2';
import { UpdateInsertObraModalComponent } from './update-insert-obra-modal/update-insert-obra-modal.component';

@Component({
  selector: 'app-tabla-obras',
  templateUrl: './tabla-obras.component.html',
  styleUrls: ['./tabla-obras.component.scss']
})

@Injectable({
  providedIn: 'root',
})

export class TablaObrasComponent implements OnInit,AfterViewInit {

  displayedColumns: string[] = ['id','nombre', 'ruc', 'director', 'estado', 'eliminar'];
  dataSource = new MatTableDataSource<Obra>([])

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private obraService: ObraService,
    private authService: AuthService,
    public dialog: MatDialog) { }

    listaObra !: Obra[];
    nuevaObr : Obra = new Obra;

  ngOnInit(): void {
    this.getData();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  filtrar(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  //Modificar estado impresora
  delImpresora(obr: Obra) {

    let estado =(obr.estadoObra)?("inhabilitar"):("habilitar");

    Swal.fire({
      title: `Desea ${estado} la impresora ${obr.idobra}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si"
    }).then((result) => {
      if (result.isConfirmed) {
        obr.estadoObra = (obr.estadoObra == 0)?(1):(0);
        this.obraService.actObra(obr).subscribe(resp=>{
          Swal.fire({
            title: "Confirmado!",
            text: "Se realizo la accion solicitada.",
            icon: "success"
          });
          this.getData();
        })}})
  }

  //insertar - modificar impresora
  actObra(obr: Obra){
    let dialog = this.dialog.open(UpdateInsertObraModalComponent, {
      data: obr,
      width: "700px",
      height: "500px"});
    dialog.afterClosed().subscribe(result => {
      this.getData();
    })
  }

  getData(){
    this.obraService.getObraAllSinEstado().subscribe(
      resp => {
        this.dataSource.data = resp;
      }
    )
  }

}

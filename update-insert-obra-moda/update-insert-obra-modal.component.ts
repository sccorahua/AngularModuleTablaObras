import { A } from '@angular/cdk/keycodes';
import { sanitizeIdentifier } from '@angular/compiler';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Obra } from 'src/app/models/obra';
import { AuthService } from 'src/app/pages/authentication/login/auth.service';
import { ObraService } from 'src/app/services/obra.service';
import { UploadService } from 'src/app/services/upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-insert-obra-modal',
  templateUrl: './update-insert-obra-modal.component.html',
  styleUrls: ['./update-insert-obra-modal.component.scss']
})

export class UpdateInsertObraModalComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<UpdateInsertObraModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Obra,
    private obraService: ObraService,
    private authService: AuthService,
    private sanitizer: DomSanitizer,
    private uploadService: UploadService
  ) { }

  obrActualiza: boolean = false;
  listaObra !: Obra[];
  logoImg : any = "";
  logoImgReport : any = "";
  logoPrevisualizacion !: string;
  logoPrevisualizacionReport !: string;

    //form
    form: FormGroup = new FormGroup({
      idObra: new FormControl(),
      nomObra: new FormControl(),
      accessIpObra: new FormControl(),
      direcObra: new FormControl(),
      RUC: new FormControl(),
      director: new FormControl(),
      contDebe: new FormControl(),
      contHaber: new FormControl(),
    })

  ngOnInit(): void {
    this.form.get('idObra').setValue(this.data.idobra);
    this.form.get('nomObra').setValue(this.data.nombreobra);
    this.form.get('accessIpObra').setValue(this.data.accessIpObra);
    this.form.get('direcObra').setValue(this.data.direcobra);
    this.form.get('RUC').setValue(this.data.nroDocObra);
    this.form.get('director').setValue(this.data.nomcompdirectobra);
    this.form.get('contDebe').setValue(this.data.contabilidadDebe);
    this.form.get('contHaber').setValue(this.data.contabilidadHaber);

    this.obraService.getObraAllSinEstado().subscribe(response=> {
      this.listaObra = response;
      this.listaObra = this.listaObra.sort(function(a,b){return a.orden-b.orden});
    })
  }

  guardarObr(){
    this.obraService.getObraAllSinEstado().subscribe(response=> {
      this.listaObra = response;
      this.listaObra = this.listaObra.sort(function(a,b){return a.orden-b.orden});

      this.data.idobra = this.form.get('idObra').value;
      this.data.nombreobra = this.form.get('nomObra').value;
      this.data.orden = this.listaObra[this.listaObra.length-1].orden+1;
      this.data.imglogourl = 'C:/logo.jpg';
      this.data.nomcompdirectobra = this.form.get('director').value;
      this.data.direcobra = this.form.get('direcObra').value;
      this.data.nroDocObra = this.form.get('RUC').value;
      this.data.iddepartobra = 1;  
      this.data.idprovinobra = 1;
      this.data.iddistriobra = 1;
      this.data.accessIpObra = this.form.get('accessIpObra').value;
      this.data.estadoObra = 1;
      this.data.fechaingobra = new Date();
      this.data.contabilidadDebe = this.form.get('contDebe').value;
      this.data.contabilidadHaber = this.form.get('contHaber').value;
      this.data.flgcursorequeobra = true;
      this.data.flgpagorequeobra = true;

      console.log(this.logoImg);
      console.log(this.logoImgReport);
      
      
      if(this.logoImg != ""){
        this.uploadService.uploadLogoColegio(this.logoImg,this.form.get("idObra").value);
      }
      if(this.logoImgReport != ""){
        this.uploadService.uploadLogoReportColegio(this.logoImgReport,this.form.get("idObra").value);
      }
      

      this.obraService.insObra(this.data).subscribe(response => {
        (response)?(Swal.fire({icon:'success',text:'Registrado correcatmente'})):(Swal.fire({icon:'error',text:'Revisar los datos ingresados'}));
      })
    })
  }

  ObtLogoImagen(event): any{
    const Logo = event.target.files[0];
      this.logoImg = Logo;
      this.convBase64(Logo).then((img:any) => {      
        this.logoPrevisualizacion = img.base;
      })
  }

  ObtLogoImagenReport(event): any{
      const Logo = event.target.files[0];
    this.logoImgReport = Logo;
    this.convBase64(Logo).then((img:any) => {      
      this.logoPrevisualizacionReport = img.base;
    })
  }

  convBase64 = async ($event: any) => new Promise((resolve, reject) => {
    try{
      const temp = window.URL.createObjectURL($event);
      const img = this.sanitizer.bypassSecurityTrustUrl(temp);
      const read = new FileReader();
      read.readAsDataURL($event);
      read.onload = () => {
        resolve({
          base: read.result
        });
      };
      read.onerror = error => {
        resolve({
          blob: $event,
          img,
          base: null
        });
      };
    } catch (e){
      return null;
    }
  })
}

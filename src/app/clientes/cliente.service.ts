import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Subject } from 'rxjs';
import { Cliente } from './cliente.model';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { stringify } from 'querystring';

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private clientes: Cliente[] = [];
  private listaClientesAtualizada = new Subject<Cliente[]>();

  getClientes(): void {
    this.httpClient.get <{mensagem: string, clientes:any}>(
      'http://localhost:3000/api/clientes'
    )
    .pipe(map((dados)=>{
      return dados.clientes.map(cliente =>{
        return{
          id: cliente._id,
          nome: cliente.nome,
          fone: cliente.fone,
          email: cliente.email
        }
      })
    }))
    .subscribe((clientes) => {
      this.clientes = clientes;
      this.listaClientesAtualizada.next([...this.clientes]);
    })
  }

  adicionarCliente(nome: string, fone: string, email: string) {
    const cliente: Cliente = {
      id: null,
      nome: nome,
      fone: fone,
      email: email,
    };

    this.httpClient.post<{mensagem: string, id: string}> ('http://localhost:3000/api/clientes',
    cliente).subscribe((dados) => {
      cliente.id = dados.id;
      this.clientes.push(cliente);
      this.listaClientesAtualizada.next([...this.clientes]);
    })
  }

  removerCliente  ( id : string ) : void {
    this.httpClient.delete(`http://localhost:3000/api/clientes/${id}`)
    .subscribe(( ) =>  {
      console.log("Remoção feita com sucesso")
      this.clientes  =  this.clientes.filter((cli) => {
        return  cli.id !== id
      })
      this.listaClientesAtualizada.next ([...this.clientes]);
      this.router.navigate(['/']);
    }) ;
  }

  getListaDeClientesAtualizadaObservable() {
    return this.listaClientesAtualizada.asObservable();
  }

  getCliente (idCliente: string) {
    //return {...this.clientes.find((cli) => cli.id === idCliente)};
    return this.httpClient.get<{id:string, nome:string, fone:string, email:string}>
    (`http://localhost:3000/api/clientes/${idCliente}`);
  }

  atualizarCliente(id:string, nome:string, fone:string, email:string) {
    const cliente: Cliente = {id, nome, fone, email};
    this.httpClient.put(`http://localhost:3000/api/clientes/${id}`, cliente)
    .subscribe(res=>{
      const copia = [...this.clientes];
      const indice = copia.findIndex(cli=>cli.id === cliente.id);
      copia[indice] = cliente;
      this.clientes = copia;
      this.listaClientesAtualizada.next([...this.clientes]);
    });
  }

  constructor (private httpClient: HttpClient, private router: Router){

  }

}

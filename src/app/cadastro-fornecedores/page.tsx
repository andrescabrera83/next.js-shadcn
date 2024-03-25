// app/fornecedores/page.tsx

"use client";

/// IMPORTS //////////////////////////////////////////////////////////////

import * as z from "zod";
import { set, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from 'axios';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
  Select,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"
import React from 'react';
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from '@supabase/supabase-js';
import { useToast } from "@/components/ui/use-toast"

const wait = () => new Promise((resolve) => setTimeout(resolve, 200));

///// ZOD SCHEMA FOR VALIDATION /////////////////////////////////////////////////////////////////

const fornecedorSchema = z.object({
  fornecedor_name: z.string().min(2).max(50),
  tempo_entrega: z.coerce.number().positive(),
  prazo_pagamento: z.coerce.number().positive(),
  dia_pedido: z.enum(["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]),
  nome_vendedor: z.string().min(2).max(50),
  contato_tel_vendedor: z.string().regex(/^[\d()+]+$/).min(5).max(14),
  email_vendedor: z.string().max(75)

})

//////////////////////////////////////////////////////////////////////// EXPORT FUNCTION


export default function CadastroFornecedores() {

  const [open, setOpen] = React.useState(false);
  const { toast } = useToast()

  //// CREATE OBJECT TO STORE VALUES SUBMITTED ///////////////////////////////////////

  const [ObjetoFornecedor, setObjetoFornecedor] = useState<{
    fornecedor_name: string,
    tempo_entrega: number,
    prazo_pagamento: number,
    dia_pedido: "Segunda" | "Terça" | "Quarta" | "Quinta" | "Sexta" | "Sábado",
    nome_vendedor: string,
    contato_tel_vendedor: string,
    email_vendedor: string
  }>({
    fornecedor_name: '',
    tempo_entrega: 0,
    prazo_pagamento: 0,
    dia_pedido: "Segunda",
    nome_vendedor: '',
    contato_tel_vendedor: '',
    email_vendedor: ''
  });

  ///////////////////////////////////////////////////////////////////////////////

  const router = useRouter(); /// ROUTER


  const sendDataToBackend = async (data: Record<string, any>) => {
    try {
        const response = await fetch('/fornecedores', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
            
        });
        if (response.ok) {
            console.log('Data sent successfully');
        } else {
            console.error('Failed to send data');
        }
    } catch (error) {
        console.error('Error sending data:', error);
    }
 };

 // Example data to send
const dataFornecedorToSend: Record<string, any> = {
  fornecedor_name: ObjetoFornecedor.fornecedor_name,
  tempo_entrega: ObjetoFornecedor.tempo_entrega,
  prazo_pagamento: ObjetoFornecedor.prazo_pagamento,
  dia_pedido: ObjetoFornecedor.dia_pedido,
  nome_vendedor: ObjetoFornecedor.nome_vendedor,
  contato_tel_vendedor: ObjetoFornecedor.contato_tel_vendedor,
  email_vendedor: ObjetoFornecedor.email_vendedor
};

  const cadastrarFornecedor = () => {
    console.log("Fornecedor Cadastrado / Redirect to Fornecedores Table")
    //console.log(ObjetoFornecedor)

    sendDataToBackend(dataFornecedorToSend);

    toast({
      title: "Fornecedor Cadastrado Com Sucesso",
      
    })

    //REDIRECT PAGE AFTER SUBMISION 
    //router.push('/fornecedores'); /// ROUTER

  }

  const handleSubmit = (values: z.infer<typeof fornecedorSchema>) => {

    //SAVES THE VALUES SUBMITTED
    setObjetoFornecedor({
      fornecedor_name: values.fornecedor_name,
      tempo_entrega: values.tempo_entrega,
      prazo_pagamento: values.prazo_pagamento,
      dia_pedido: values.dia_pedido,
      nome_vendedor: values.nome_vendedor,
      contato_tel_vendedor: values.contato_tel_vendedor,
      email_vendedor: values.email_vendedor
    })

    //OPEN DIALOG TO CONFIRM SUBMIT
    wait().then(() => setOpen(true));

  }

  const form = useForm<z.infer<typeof fornecedorSchema>>({
    resolver: zodResolver(fornecedorSchema),
    defaultValues: {
      fornecedor_name: "",
    }
  })

  return (
    <div className='flex items-center justify-center'>
      <div className='flex flex-col w-full md:w-11/12 2xl:w-2/4 mt-5 bg-white rounded-md p-10 border '>
        <span className='text-3xl'>Cadastro de Fornecedor</span>
        <span className="text-xl mt-6">Detalhes Basicos</span>

        <Form {...form}>

          <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-4 flex flex-col">

            <div className="flex flex-row ">

              <FormField
                control={form.control}
                name="fornecedor_name"
                render={({ field }) => {

                  return (
                    <FormItem className="w-2/4 my-4 mr-6">
                      <FormLabel> Nome Do Fornecedor</FormLabel>
                      <FormControl>
                        <Input placeholder="'Fornecedor'" className="placeholder:italic" type="text" {...field} />
                      </FormControl>

                    </FormItem>
                  )
                }}

              />

              <FormField
                control={form.control}
                name="tempo_entrega"
                render={({ field }) => {

                  return (
                    <FormItem className="w-2/4 my-4 ">
                      <FormLabel> Tempo De Entrega Do Produto (Em Dias)</FormLabel>
                      <FormControl>


                        <Input placeholder="'Dias'" className="placeholder:italic" type="number" min="0" {...field} />

                      </FormControl>

                    </FormItem>
                  )
                }}

              />

            </div>

            <div className="flex flex-row ">
              <FormField
                control={form.control}
                name="prazo_pagamento"
                render={({ field }) => {

                  return (
                    <FormItem className="w-2/4 my-4 mr-6">
                      <FormLabel> Prazo Para Pagamento (Em Dias)</FormLabel>
                      <FormControl>
                        <Input placeholder="'Dias'" className="placeholder:italic" type="number"  min="0"{...field} />
                      </FormControl>

                    </FormItem>
                  )
                }}
              />

              <FormField
                control={form.control}
                name="dia_pedido"
                render={({ field }) => {
                  return (
                    <FormItem className="w-2/4 my-4">
                      <FormLabel>Dia Fixo Para Realizar O Pedido</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione Um Dia" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>

                          <SelectItem value="Segunda">Segunda</SelectItem>
                          <SelectItem value="Terça">Terça</SelectItem>
                          <SelectItem value="Quarta">Quarta</SelectItem>
                          <SelectItem value="Quinta">Quinta</SelectItem>
                          <SelectItem value="Sexta">Sexta</SelectItem>
                          <SelectItem value="Sábado">Sábado</SelectItem>

                        </SelectContent>
                      </Select>

                    </FormItem>
                  );
                }}
              />
            </div>

            <span className="text-xl mt-6">Detalhes Do Vendedor</span>

            <div className="flex flex-row ">
              <FormField
                control={form.control}
                name="nome_vendedor"
                render={({ field }) => {
                  return (
                    <FormItem className="w-2/4 my-4 mr-6">
                      <FormLabel> Nome Do(a) Vendedor(a)</FormLabel>
                      <FormControl>
                        <Input placeholder="'Nome Do(a) Vendedor(a)'" className="placeholder:italic" type="text" {...field} />
                      </FormControl>
                    </FormItem>
                  )
                }}
              />
              <FormField
                control={form.control}
                name="contato_tel_vendedor"
                render={({ field }) => {
                  return (
                    <FormItem className="w-2/4 my-4 mr-6">
                      <FormLabel> Contato Telefonico</FormLabel>
                      <FormControl>
                        <Input placeholder="'Contato Telefonico'" className="placeholder:italic" type="text" {...field} />
                      </FormControl>
                    </FormItem>
                  )
                }}
              />
            </div>

            <FormField
              control={form.control}
              name="email_vendedor"
              render={({ field }) => {
                return (
                  <FormItem className="w-2/4 my-4 mr-6">
                    <FormLabel> E-Mail</FormLabel>
                    <FormControl>
                      <Input placeholder="'Exemplo@Email.com'" className="placeholder:italic" type="text" {...field} />
                    </FormControl>
                  </FormItem>
                )
              }}
            />

            <Button type="submit" className="my-5">
              Cadastrar
            </Button>

          </form>

        </Form>

        <Dialog open={open} onOpenChange={setOpen} >
          <DialogContent className="p-9 min-w-[700px] ">
            <DialogHeader>
              <DialogTitle className="pr-60 text-2xl mx-3 mb-4">Tem certeza que deseja cadastrar o seguinte fornecedor?</DialogTitle>
              <DialogDescription className="mt-50">

                <span className="text-lg mx-3 ">Confera os seguintes dados para cadastrar na base de dados.</span>

              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col px-4 py-5  mx-3 border-2 rounded-md">

              <div className="flex justify-between border-b border-gray-300 mb-4 items-end px-2">
                <h2 className="flex-grow text-black   text-xl font-light">Nome Do Fornecedor:</h2>
                <h2 className="text-black   text-xl font-semibold">{ObjetoFornecedor.fornecedor_name}</h2>
              </div>

              <div className="flex justify-between border-b border-gray-300 mb-4 items-end px-2">
                <h2 className="flex-grow text-black   text-xl font-light">Tempo De Entrega:</h2>
                <h2 className="text-black   text-xl font-semibold">{ObjetoFornecedor.tempo_entrega} Dias</h2>
              </div>

              <div className="flex justify-between border-b border-gray-300 mb-4 items-end px-2">
                <span className="flex-grow text-black text-xl font-light">Prazo do Pagamento:</span>
                <h2 className="text-black   text-xl font-semibold">{ObjetoFornecedor.prazo_pagamento} Dias</h2>
              </div>

              <div className="flex justify-between border-b border-gray-300 mb-4 items-end px-2">
                <span className="flex-grow text-black text-xl font-light">Dia Para Realizar Pedido:</span>
                <h2 className="text-black   text-xl font-semibold">{ObjetoFornecedor.dia_pedido}</h2>
              </div>

              <div className="flex justify-between border-b border-gray-300 mb-4 items-end px-2">
                <span className="flex-grow text-black text-xl font-light">Nome Do Vendedor:</span>
                <h2 className="text-black   text-xl font-semibold">{ObjetoFornecedor.nome_vendedor}</h2>
              </div>

              <div className="flex justify-between border-b border-gray-300 mb-4 items-end px-2">
                <span className="flex-grow text-black text-xl font-light">Telefone Do Vendedor:</span>
                <h2 className="text-black   text-xl font-semibold">{ObjetoFornecedor.contato_tel_vendedor}</h2>
              </div>

              <div className="flex justify-between border-b border-gray-300 mb-4 items-end px-2">
                <span className="flex-grow text-black text-xl font-light">Email Do Vendedor:</span>
                <h2 className="text-black   text-xl font-semibold">{ObjetoFornecedor.email_vendedor}</h2>
              </div>

            </div>

            <DialogFooter className="sm:justify-end mt-5 mx-3">
              <DialogClose asChild>
                <Button type="button" onClick={cadastrarFornecedor}>
                  Cadastrar
                </Button>
              </DialogClose>
            </DialogFooter>

          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
};



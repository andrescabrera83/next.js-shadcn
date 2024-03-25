

"use client";

//IMPORTS //////////////////////////////////////////////////////////////////

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import React from 'react'

import { useState } from "react";
import { createClient } from '@supabase/supabase-js';
import { useEffect } from 'react';
//import { useRouter } from "next/navigation";

const wait = () => new Promise((resolve) => setTimeout(resolve, 700));

////////////////////////////////////////////////////////////////////////////////////////////

const supabaseUrl2 = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey2 = process.env.NEXT_PUBLIC_SUPABASE_KEY || '';

const supabase = createClient(supabaseUrl2, supabaseKey2);

///// ZOD SCHEMA FOR VALIDATION /////////////////////////////////////////////////////////////////

const materiasPrimasSchema = z.object({
  materiaprima_name: z.string().min(2).max(50),
  measurement_unit: z.enum(["KG", "UN"]),
  weight: z.coerce.number().positive(),
  quantity: z.coerce.number().positive(),
  price: z.coerce.number(),
  category: z.enum(["Carnes", "Farinhas", "Hortifruti", "Mercearia", "Misturas", "Ovos", "Queijos"]),
  min_order: z.coerce.number().positive().int(),
  gasto_medio: z.coerce.number().positive(),
  fornecedor_id: z.coerce.number().positive(),


}).transform((val) => {
  if (val.measurement_unit === "UN") {
    return { ...val, weight: 0 }
  } else if (val.measurement_unit === "KG") {
    return { ...val, quantity: 0 }
  }
  return val
})

///INTERFACES //////////////////////////////////////////////////////////

interface MateriasPrimas {
  materiaprima_name: string,
  measurement_unit: "KG" | "UN",
  weight: number,
  quantity: number,
  price: number,
  category: "Carnes" | "Farinhas" | "Hortifruti" | "Mercearia" | "Misturas" | "Ovos" | "Queijos",
  min_order: number,
  gasto_medio: number,
  fornecedor_id: number

}



interface Fornecedor {
  id: number,
  fornecedor_name: string;
  tempo_entrega: number;
  prazo_pagamento: number;
  dia_pedido: "Segunda" | "Terça" | "Quarta" | "Quinta" | "Sexta" | "Sábado";
  nome_vendedor: string;
  contato_tel_vendedor: string;
  email_vendedor: string;
}

//////////////////////////////////////////////////////////////////////// EXPORT FUNCTION

export default function CadastroMateriasPrimas() {

  const [open, setOpen] = React.useState(false);

  //const router = useRouter(); /// ROUTER

  //// CREATE OBJECT TO STORE VALUES SUBMITTED ///////////////////////////////////////

  const [FornecedorData, setFornecedorData] = useState<Fornecedor[]>([]);

  const [ObjetoMateriasPrimas, setObjetoMateriasPrimas] = useState<{
    materiaprima_name: string,
    measurement_unit: "KG" | "UN",
    weight: number,
    quantity: number,
    price: number,
    category: "Carnes" | "Farinhas" | "Hortifruti" | "Mercearia" | "Misturas" | "Ovos" | "Queijos",
    min_order: number,
    gasto_medio: number,
    fornecedor_id: number,
  }>({
    materiaprima_name: '',
    measurement_unit: "KG",
    weight: 0,
    quantity: 0,
    price: 0,
    category: "Carnes",
    min_order: 0,
    gasto_medio: 0,
    fornecedor_id: 1,
  });

  const handleSubmit = (values: z.infer<typeof materiasPrimasSchema>) => {
    //SAVES THE VALUES SUBMITTED
    setObjetoMateriasPrimas({
      materiaprima_name: values.materiaprima_name,
      measurement_unit: values.measurement_unit,
      weight: values.weight,
      quantity: values.quantity,
      price: values.price,
      category: values.category,
      min_order: values.min_order,
      gasto_medio: values.gasto_medio,
      fornecedor_id: values.fornecedor_id,
      
    })
     //wait().then(() => 
    setOpen(true);
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const { data, error } = await supabase.from('fornecedores').select('*');
        if (error) {
          throw error;
        }
        setFornecedorData(data as Fornecedor[]); // Cast data to the TableRow[] type
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, []);

  const cadastrarMateriasPrimas = async () => {
    console.log("Materia Prima Cadastrada / Redirect to MateriasPrimas Table")
    console.log(ObjetoMateriasPrimas) 
    //router.push('/materiasprimas'); /// ROUTER
  }


  

  const form = useForm<z.infer<typeof materiasPrimasSchema>>({
    resolver: zodResolver(materiasPrimasSchema),
    defaultValues: {
      materiaprima_name: "",
      measurement_unit: "KG",
      weight: 1,
      quantity: 1,
      price: 1,
      category: "Mercearia",
      min_order: 1,
      gasto_medio: 1
    }
  });

  return (
    <div className='flex items-center justify-center'>
      <div className='justify-start w-full md:w-11/12 2xl:w-2/4 mt-5 bg-white rounded-md p-10 border '>
        <span className='text-3xl'>Cadastro de Materias Primas</span>

        <Form {...form}>

          <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-8 flex flex-col">

            <FormField
              control={form.control}
              name="materiaprima_name"
              render={({ field }) => {
                return <FormItem className="w-4/4">
                  <FormLabel> Nome Da Materia Prima</FormLabel>
                  <FormControl>
                    <Input placeholder="'Cebola Branca'" className="placeholder:italic" type="text" {...field} />
                  </FormControl>
                </FormItem>
              }}
            />

            <FormField
              control={form.control}
              name="measurement_unit"
              render={({ field }) => {
                return <FormItem className="w-4/4 my-4">

                  <FormControl>
                    <Tabs defaultValue="KG" className="w-[400px]" onValueChange={field.onChange}>
                      <TabsList>
                        <TabsTrigger value="KG">KG</TabsTrigger>
                        <TabsTrigger value="UN">UN</TabsTrigger>
                      </TabsList>
                      <TabsContent value="KG">

                        <FormField
                          control={form.control}
                          name="weight"
                          render={({ field }) => {
                            return <FormItem className="w-2/4">
                              <FormLabel> Peso(KG)</FormLabel>
                              <FormControl>
                                <Input placeholder="5 KG" type="number"{...field} min="0" inputMode="decimal" />
                              </FormControl>
                            </FormItem>
                          }}
                        />

                      </TabsContent>
                      <TabsContent value="UN">
                        <FormField
                          control={form.control}
                          name="quantity"
                          render={({ field }) => {
                            return <FormItem className="w-2/4">
                              <FormLabel>Quantidade</FormLabel>
                              <FormControl>
                                <Input type="number" min="0"{...field} />

                              </FormControl>

                            </FormItem>
                          }}
                        />
                      </TabsContent>
                    </Tabs>
                  </FormControl>
                </FormItem>
              }}
            />

            <div className="flex flex-row ">

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => {
                  return <FormItem className="w-2/4 my-4 mr-6">
                    <FormLabel> Custo (R$)</FormLabel>
                    <FormControl>
                      <Input placeholder="'R$99.99'" className="placeholder:italic" type="number" min="0" step=".01" inputMode="decimal" {...field} />
                    </FormControl>

                  </FormItem>
                }}
              />

              <FormField
                control={form.control}
                name="min_order"
                render={({ field }) => {
                  return <FormItem className="w-2/4 my-4">
                    <FormLabel> Pedido Minimo</FormLabel>
                    <FormControl>
                      <Input placeholder="'2'" className="placeholder:italic" type="number" min="0" {...field} />
                    </FormControl>

                  </FormItem>
                }}
              />

            </div>

            <div className="flex flex-row ">

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => {
                  return (
                    <FormItem className="w-2/4 my-4 mr-6">
                      <FormLabel>Departamento</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione um departamento" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>

                          <SelectItem value="Carnes">Carnes</SelectItem>
                          <SelectItem value="Farinhas">Farinhas</SelectItem>
                          <SelectItem value="Hortifruti">Hortifruti</SelectItem>
                          <SelectItem value="Mercearia">Mercearia</SelectItem>
                          <SelectItem value="Misturas">Misturas</SelectItem>
                          <SelectItem value="Ovos">Ovos</SelectItem>
                          <SelectItem value="Queijos">Queijos</SelectItem>

                        </SelectContent>
                      </Select>

                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="gasto_medio"
                render={({ field }) => {
                  return <FormItem className="w-2/4 my-4">
                    <FormLabel> Gasto médio em kg/uni por dia de consumo</FormLabel>
                    <FormControl>
                      <Input placeholder="'123'" className="placeholder:italic" type="number" min="0"{...field} />
                    </FormControl>
                  </FormItem>
                }}
              />

            </div>

            <FormField
              control={form.control}
              name="fornecedor_id"
              render={({ field }) => {
                return (
                  <FormItem className="w-2/4 my-4 mr-6">
                    <FormLabel>Fornecedor</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione um fornecedor" />
                        </SelectTrigger>

                      </FormControl>



                      <SelectContent>

                        {FornecedorData.map((row, index) => (

                          <SelectItem key={index} value={row.id.toString()}>{row.fornecedor_name}</SelectItem>

                        ))}


                      </SelectContent>



                    </Select>
                    <FormMessage />

                  </FormItem>
                );
              }}
            />



            <Button type="submit" className="my-5" >
              Cadastrar
            </Button>
          </form>
        </Form>


        <Dialog open={open} onOpenChange={setOpen} >
          <DialogContent className="p-9 min-w-[700px] ">
            <DialogHeader>
              <DialogTitle className="pr-60 text-2xl mx-3 mb-4">Tem certeza que deseja cadastrar a seguinte materia prima?</DialogTitle>
              <DialogDescription className="mt-50">

                <span className="text-lg mx-3 ">Confera os seguintes dados para cadastrar na base de dados.</span>

              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col px-4 py-5  mx-3 border-2 rounded-md">

              <div className="flex justify-between border-b border-gray-300 mb-4 items-end px-2">
                <h2 className="flex-grow text-black   text-xl font-light">Produto:</h2>
                <h2 className="text-black   text-xl font-semibold">{ObjetoMateriasPrimas.materiaprima_name}</h2>
              </div>

              <div className="flex justify-between border-b border-gray-300 mb-4 items-end px-2">
                <span className="flex-grow text-black text-xl font-light">Peso:</span>
                <h2 className="text-black   text-xl font-semibold">{ObjetoMateriasPrimas.weight} KG </h2>
              </div>

              <div className="flex justify-between border-b border-gray-300 mb-4 items-end px-2">
                <span className="flex-grow text-black text-xl font-light">Quantidade:</span>
                <h2 className="text-black   text-xl font-semibold">{ObjetoMateriasPrimas.quantity}</h2>
              </div>

              <div className="flex justify-between border-b border-gray-300 mb-4 items-end px-2">
                <span className="flex-grow text-black text-xl font-light">Custo(R$):</span>
                <h2 className="text-black   text-xl font-semibold">R${ObjetoMateriasPrimas.price}</h2>
              </div>

              <div className="flex justify-between border-b border-gray-300 mb-4 items-end px-2">
                <span className="flex-grow text-black text-xl font-light">Departamento:</span>
                <h2 className="text-black   text-xl font-semibold">{ObjetoMateriasPrimas.category}</h2>
              </div>

              <div className="flex justify-between border-b border-gray-300 mb-4 items-end px-2">
                <span className="flex-grow text-black text-xl font-light">Pedido Minimo:</span>
                <h2 className="text-black   text-xl font-semibold">{ObjetoMateriasPrimas.min_order}</h2>
              </div>

              <div className="flex justify-between border-b border-gray-300 mb-4 items-end px-2">
                <span className="flex-grow text-black text-xl font-light">Gasto Medio:</span>
                <h2 className="text-black   text-xl font-semibold">{ObjetoMateriasPrimas.gasto_medio}</h2>
              </div>

              <div className="flex justify-between border-b border-gray-300 mb-4 items-end px-2">
                <span className="flex-grow text-black text-xl font-light">Fornecedor Nome:</span>
                <h2 className="text-black   text-xl font-semibold">{ObjetoMateriasPrimas.fornecedor_id}</h2>
              </div>

            </div>

            <DialogFooter className="sm:justify-end mt-5 mx-3">
              <DialogClose asChild>
                <Button type="button" onClick={cadastrarMateriasPrimas}>
                  Cadastrar
                </Button>
              </DialogClose>
            </DialogFooter>

          </DialogContent>
        </Dialog>


      </div>
    </div>
  )
}

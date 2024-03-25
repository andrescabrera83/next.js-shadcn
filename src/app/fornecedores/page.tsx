"use client"

// IMPORTS ////////////////////////////////////////

import React from 'react'
import { useRouter } from "next/navigation";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button";

import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

interface Fornecedor {
    id: number;
    fornecedor_name: string;
    tempo_entrega: number;
    prazo_pagamento: number;
    dia_pedido: "Segunda" | "Terça" | "Quarta" | "Quinta" | "Sexta" | "Sábado";
    nome_vendedor: string;
    contato_tel_vendedor: string;
    email_vendedor: string;
  }


export default function Fornecedores() {

    const [tableData, setTableData] = useState<Fornecedor[]>([]);

    useEffect(() => {
        async function fetchData() {
          try {
            const { data, error } = await supabase.from('fornecedores').select('*');
            if (error) {
              throw error;
            }
            setTableData(data as Fornecedor[]); // Cast data to the TableRow[] type
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        }
        fetchData();
      }, []);


    return (
        <div className='flex items-center justify-center mx-8 my-6'>
            <div className='flex flex-col w-full  2xl:w-5/6 mt-5 bg-white rounded-md p-10 border '>

            <span className='text-3xl'>Fornecedores</span>

            <Table className='mt-8'>
        
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead className="text-center">  Fornecedor </TableHead>
            <TableHead className="text-center">Tempo de entrega do produto (em dias)</TableHead>
            <TableHead className="text-center">Prazo para pagamento(em dias)</TableHead>
            <TableHead className="text-center">Dia fixo para realizar o pedido</TableHead>
            <TableHead className="text-center">Nome do(a) Vendedor(a)</TableHead>
            <TableHead className="text-center">Contato Telefônico</TableHead>
            <TableHead className="text-right">E-mail </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.map((row, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium ">{row.id}</TableCell>
              <TableCell className='text-center'>{row.fornecedor_name}</TableCell>
              <TableCell className='text-center'>{row.tempo_entrega} Dias</TableCell>
              <TableCell className='text-center'>{row.prazo_pagamento} Dias</TableCell>
              <TableCell className='text-center'>{row.dia_pedido}</TableCell>
              <TableCell className='text-center'>{row.nome_vendedor}</TableCell>
              <TableCell className='text-center'>{row.contato_tel_vendedor}</TableCell>
              <TableCell className='text-right'>{row.email_vendedor}</TableCell>
              
              
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className='flex w-full justify-end'>
      <Button type='button' className="mt-12 w-[260px]" onClick={() => {

            

      }}>

        Cadastrar Novo Fornecedor

      </Button>

      </div>

            </div>
        </div>
    )
}


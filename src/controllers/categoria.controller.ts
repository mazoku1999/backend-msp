import { Request, Response } from 'express';
import pool from '../config/database';
import { CreateCategoriaDTO, UpdateCategoriaDTO } from '../models/categoria.model';

export const getCategorias = async (req: Request, res: Response) => {
    try {
        const [categorias] = await pool.execute(`
            SELECT 
                id,
                nombre as name,
                descripcion as description,
                estado as status,
                fecha_creacion as created_at
            FROM categoria
        `);
        return res.json(categorias);
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const getCategoria = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const [categorias] = await pool.execute(`
            SELECT 
                id,
                nombre as name,
                descripcion as description,
                estado as status,
                fecha_creacion as created_at
            FROM categoria 
            WHERE id = ?
        `, [id]);

        if (!categorias || (categorias as any[]).length === 0) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }

        return res.json((categorias as any[])[0]);
    } catch (error) {
        console.error('Error al obtener categoría:', error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const createCategoria = async (req: Request, res: Response) => {
    try {
        const { nombre, descripcion }: CreateCategoriaDTO = req.body;

        const [existente] = await pool.execute(
            'SELECT id FROM categoria WHERE nombre = ?',
            [nombre]
        );

        if ((existente as any[]).length > 0) {
            return res.status(400).json({ message: 'Ya existe una categoría con ese nombre' });
        }

        const [result] = await pool.execute(
            'INSERT INTO categoria (nombre, descripcion) VALUES (?, ?)',
            [nombre, descripcion]
        );

        return res.status(201).json({
            id: (result as any).insertId,
            nombre,
            descripcion,
            estado: 'activo'
        });
    } catch (error) {
        console.error('Error al crear categoría:', error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const updateCategoria = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updates: UpdateCategoriaDTO = req.body;

        if (updates.nombre) {
            const [existente] = await pool.execute(
                'SELECT id FROM categoria WHERE nombre = ? AND id != ?',
                [updates.nombre, id]
            );

            if ((existente as any[]).length > 0) {
                return res.status(400).json({ message: 'Ya existe una categoría con ese nombre' });
            }
        }

        let query = 'UPDATE categoria SET ';
        const values: any[] = [];
        const updateFields: string[] = [];

        if (updates.nombre) {
            updateFields.push('nombre = ?');
            values.push(updates.nombre);
        }
        if (updates.descripcion) {
            updateFields.push('descripcion = ?');
            values.push(updates.descripcion);
        }
        if (updates.estado) {
            updateFields.push('estado = ?');
            values.push(updates.estado);
        }

        query += updateFields.join(', ') + ' WHERE id = ?';
        values.push(id);

        await pool.execute(query, values);

        return res.json({ message: 'Categoría actualizada correctamente' });
    } catch (error) {
        console.error('Error al actualizar categoría:', error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const deleteCategoria = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Verificar si hay noticias o videos usando esta categoría
        const [noticias] = await pool.execute(
            'SELECT id FROM noticia WHERE categoria_id = ?',
            [id]
        );

        const [videos] = await pool.execute(
            'SELECT id FROM video WHERE categoria_id = ?',
            [id]
        );

        if ((noticias as any[]).length > 0 || (videos as any[]).length > 0) {
            return res.status(400).json({
                message: 'No se puede eliminar la categoría porque está siendo utilizada'
            });
        }

        await pool.execute('DELETE FROM categoria WHERE id = ?', [id]);
        return res.json({ message: 'Categoría eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar categoría:', error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const cambiarEstadoCategoria = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        if (!['activo', 'inactivo'].includes(estado)) {
            return res.status(400).json({ message: 'Estado inválido' });
        }

        await pool.execute(
            'UPDATE categoria SET estado = ? WHERE id = ?',
            [estado, id]
        );

        return res.json({ message: 'Estado de categoría actualizado correctamente' });
    } catch (error) {
        console.error('Error al cambiar estado de categoría:', error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const getCategoriasConConteos = async (req: Request, res: Response) => {
    try {
        const [categorias] = await pool.execute(`
            SELECT 
                c.id,
                c.nombre as name,
                c.descripcion as description,
                c.estado as status,
                c.fecha_creacion as created_at,
                COALESCE((SELECT COUNT(*) FROM noticia n WHERE n.categoria_id = c.id), 0) as news_count,
                COALESCE((SELECT COUNT(*) FROM video v WHERE v.categoria_id = c.id), 0) as videos_count
            FROM categoria c
            ORDER BY c.nombre ASC
        `);

        const response = (categorias as any[]).map(categoria => ({
            id: categoria.id,
            name: categoria.name,
            description: categoria.description,
            status: categoria.status,
            created_at: categoria.created_at,
            news_count: Number(categoria.news_count),
            videos_count: Number(categoria.videos_count)
        }));

        return res.json(response);
    } catch (error) {
        console.error('Error al obtener categorías con conteos:', error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const getCategoriasPublicas = async (req: Request, res: Response) => {
    try {
        const [categorias] = await pool.execute(`
            SELECT 
                id,
                nombre as name,
                descripcion as description,
                fecha_creacion as created_at
            FROM categoria
            WHERE estado = 'activo'
            ORDER BY nombre ASC
        `);
        return res.json(categorias);
    } catch (error) {
        console.error('Error al obtener categorías públicas:', error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const getCategoriasConConteosPublicos = async (req: Request, res: Response) => {
    try {
        const [categorias] = await pool.execute(`
            SELECT 
                c.id,
                c.nombre as name,
                c.descripcion as description,
                c.fecha_creacion as created_at,
                COALESCE((
                    SELECT COUNT(*) 
                    FROM noticia n 
                    WHERE n.categoria_id = c.id 
                    AND n.estado = 'publicado'
                ), 0) as news_count,
                COALESCE((
                    SELECT COUNT(*) 
                    FROM video v 
                    WHERE v.categoria_id = c.id 
                    AND v.estado = 'publicado'
                ), 0) as videos_count
            FROM categoria c
            WHERE c.estado = 'activo'
            ORDER BY c.nombre ASC
        `);

        const response = (categorias as any[]).map(categoria => ({
            id: categoria.id,
            name: categoria.name,
            description: categoria.description,
            created_at: categoria.created_at,
            news_count: Number(categoria.news_count),
            videos_count: Number(categoria.videos_count)
        }));

        return res.json(response);
    } catch (error) {
        console.error('Error al obtener categorías públicas con conteos:', error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
}; 
import express, { application, response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { hour2minute } from './utils/convert-hour-string-to-minutes';
import { minutes2hour } from './utils/convert-minutes-to hour-string';
const app = express();
app.use(express.json())
app.use(cors())
const prisma = new PrismaClient({
    log: ['query']
});
app.post('/games/:id/ads', async(req, res, next) => {
    try{
        const gameId = req.params.id;
        const body = req.body;
        const ad = await prisma.ad.create({
            data:{
                gameId,
                name: body.name,
                yearsPlaying: body.yearsPlaying,
                discord: body.discord,
                weekDays: body.weekDays.join(','),
                hourStart: hour2minute(body.hourStart),
                hourEnd: hour2minute(body.hourEnd),
                useVoiceChannel: body.useVoiceChannel
            }
        })
        return res.status(201).json(ad);
    }
    catch(err){
        return next(err);
    }
})
app.get('/games', async (req, res) => {
    const games = await prisma.game.findMany({
        include: {
            _count: {
                select: {
                    ads: true
                }
            }
        }
    });
    return res.json(games);
})
app.get('/ads/:id/discord', async (req, res, next) => {
    try{
        const adId = req.params.id;
        const discord = await prisma.ad.findUniqueOrThrow({
            select: {
                discord: true
            },
            where: {
                id: adId
            }
        })
        return res.json(discord.discord);
    }
    catch(err:any){
        return next(err)
    }
})
app.get('/games/:id/ads', async (req, res) => {
    const gameId= req.params.id;
    const ads = await prisma.ad.findMany({
        select:{
            id:true,
            createdAt:true,
            hourStart:true,
            hourEnd:true,
            name:true,
            useVoiceChannel:true,
            weekDays:true,
            yearsPlaying:true
        },
        where:{
            gameId
        },
        orderBy:{
            createdAt: 'asc'
        }
    })
    return res.json(ads.map(ad=>{
        return {
            ...ad,
            weekDays: ad.weekDays.split(','),
            hourStart: minutes2hour(ad.hourStart),
            hourEnd: minutes2hour(ad.hourEnd),
        }
    }));
});
app.listen(3333);

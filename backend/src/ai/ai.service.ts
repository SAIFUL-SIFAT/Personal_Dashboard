import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../tasks/entities/task.entity';
import { Expense } from '../expenses/entities/expense.entity';
import { Workout } from '../habits/entities/workout.entity';
import { CodingLog } from '../coding/entities/coding.entity';

@Injectable()
export class AiService {
    private genAI: GoogleGenerativeAI;

    constructor(
        private configService: ConfigService,
        @InjectRepository(Task) private taskRepo: Repository<Task>,
        @InjectRepository(Expense) private expenseRepo: Repository<Expense>,
        @InjectRepository(Workout) private workoutRepo: Repository<Workout>,
        @InjectRepository(CodingLog) private codingRepo: Repository<CodingLog>,
    ) {
        const apiKey = this.configService.get<string>('GEMINI_API_KEY') || 'YOUR_API_KEY';
        console.log('Gemini API Key loaded:', !!apiKey && apiKey !== 'YOUR_API_KEY');
        this.genAI = new GoogleGenerativeAI(apiKey);
    }

    async getChatResponse(prompt: string): Promise<string> {
        try {
            // Get context data
            const tasks = await this.taskRepo.find({ take: 10, order: { createdAt: 'DESC' } });
            const expenses = await this.expenseRepo.find({ take: 10, order: { createdAt: 'DESC' } });
            const workouts = await this.workoutRepo.find({ take: 10, order: { date: 'DESC' } });
            const coding = await this.codingRepo.find({ take: 10, order: { date: 'DESC' } });

            console.log('AI Request Prompt:', prompt);
            const context = `
            You are a Strategic AI Assistant for the user's Personal Dashboard. 
            You have a direct, professional, yet slightly futuristic/operational tone.
            
            Current Intelligence Context:
            - Recent Tasks: ${tasks.map(t => `${t.title} (${t.status})`).join(', ') || 'None'}
            - Recent Expenses: ${expenses.map(e => `${e.note || e.category}: ${e.amount}`).join(', ') || 'None'}
            - Recent Workouts: ${workouts.map(w => `${w.muscleGroup}: ${w.count}`).join(', ') || 'None'}
            - Recent Coding Sessions: ${coding.map(c => `${c.language}: ${c.minutes}m`).join(', ') || 'None'}

            User Request: ${prompt}
            `;

            const model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const result = await model.generateContent(context);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('AI Error Details:', JSON.stringify(error, null, 2));
            return "Neural Link Interrupted. Unable to process command at this time.";
        }
    }
}

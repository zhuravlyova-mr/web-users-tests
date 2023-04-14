import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {ValidationPipe} from "./pipes/validation.pipe";


export async function start() {
    const PORT = process.env.PORT || 5000;
    const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
        .setTitle('Бэкэнд для web-пользователей некоторого сайта')
        .setDescription('Документация REST API')
        .setVersion('1.0.0.')
        .addTag('Документ')
        .build(); 
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
    
    
    await app.listen(PORT, () => 
        console.log(`Server started on port ${PORT}`));
}

start();

import asyncio
import sys
import json
from typing import List, Optional, Dict
from bs4 import BeautifulSoup
from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig
from crawl4ai.markdown_generation_strategy import DefaultMarkdownGenerator

# Configurar la codificación para Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

class EventbriteCrawler:
    def __init__(self, base_url: str = "https://www.eventbrite.com/d/argentina--buenos-aires/all-events/"):
        self.base_url = base_url
        self.browser_config = BrowserConfig(
            headless=True,
            extra_args=["--disable-gpu", "--disable-dev-shm-usage", "--no-sandbox"],
        )
        self.crawl_config = CrawlerRunConfig(
            markdown_generator=DefaultMarkdownGenerator()
        )

    def parse_events(self, html_content: str) -> List[Dict]:
        """
        Parse the HTML content to extract event information
        """
        soup = BeautifulSoup(html_content, 'html.parser')
        events = []
        
        # Buscar todos los artículos de eventos
        event_articles = soup.find_all('article', {'data-testid': 'event-card'})
        
        for article in event_articles:
            event = {}
            
            # Título del evento
            title_element = article.find('div', {'data-testid': 'event-card-title'})
            if title_element:
                event['title'] = title_element.text.strip()
            
            # Fecha y hora
            datetime_element = article.find('div', {'data-testid': 'event-card-start-date'})
            if datetime_element:
                event['datetime'] = datetime_element.text.strip()
            
            # Ubicación
            location_element = article.find('div', {'data-testid': 'event-card-venue'})
            if location_element:
                event['location'] = location_element.text.strip()
            
            # URL del evento
            link_element = article.find('a', {'data-testid': 'event-card-link'})
            if link_element:
                event['url'] = link_element.get('href', '')
            
            # Imagen del evento
            img_element = article.find('img')
            if img_element:
                event['image_url'] = img_element.get('src', '')
            
            if event:
                events.append(event)
        
        return events

    async def crawl_events(self) -> Optional[List[Dict]]:
        """
        Crawls Eventbrite events page and returns the events information
        """
        crawler = AsyncWebCrawler(config=self.browser_config)
        await crawler.start()

        try:
            session_id = "eventbrite_session"
            result = await crawler.arun(
                url=self.base_url,
                config=self.crawl_config,
                session_id=session_id
            )
            
            if result.success:
                print(f"Successfully crawled Eventbrite events")
                events = self.parse_events(result.html)
                return events
            else:
                print(f"Failed to crawl: {result.error_message}")
                return None
                
        finally:
            await crawler.close()

    def format_events_markdown(self, events: List[Dict]) -> str:
        """
        Format the events into a clean markdown format
        """
        markdown = "# Eventos en Buenos Aires\n\n"
        
        for event in events:
            markdown += f"## {event.get('title', 'Sin título')}\n\n"
            markdown += f"**Fecha y hora:** {event.get('datetime', 'No especificado')}\n\n"
            markdown += f"**Ubicación:** {event.get('location', 'No especificada')}\n\n"
            markdown += f"**Link:** [{event.get('title', 'Ver evento')}]({event.get('url', '#')})\n\n"
            if event.get('image_url'):
                markdown += f"![Imagen del evento]({event.get('image_url')})\n\n"
            markdown += "---\n\n"
        
        return markdown

async def main():
    try:
        crawler = EventbriteCrawler()
        events = await crawler.crawl_events()
        
        if events:
            # Save the raw JSON data
            with open("eventbrite_events.json", "w", encoding="utf-8") as f:
                json.dump(events, f, ensure_ascii=False, indent=2)
            print("Events have been saved to eventbrite_events.json")
            
            # Save the formatted markdown
            markdown_content = crawler.format_events_markdown(events)
            with open("eventbrite_events.md", "w", encoding="utf-8") as f:
                f.write(markdown_content)
            print("Events have been saved to eventbrite_events.md")
        else:
            print("Failed to get events")
    except Exception as e:
        print(f"Error occurred: {str(e)}")

if __name__ == "__main__":
    asyncio.run(main())

import { NextRequest, NextResponse } from 'next/server';

interface FeedItem {
  title: string;
  link: string;
  pubDate?: string;
  description?: string;
}

function parseRSS(xml: string): FeedItem[] {
  const items: FeedItem[] = [];
  
  // Simple regex-based RSS parser
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match;
  
  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];
    
    const title = itemXml.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i)?.[1] || '';
    const link = itemXml.match(/<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i)?.[1] || 
                 itemXml.match(/<link[^>]*href="([^"]*)"[^>]*\/?>/i)?.[1] || '';
    const pubDate = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/i)?.[1] ||
                    itemXml.match(/<published>([\s\S]*?)<\/published>/i)?.[1] ||
                    itemXml.match(/<updated>([\s\S]*?)<\/updated>/i)?.[1] || '';
    const description = itemXml.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i)?.[1] || '';
    
    if (title && link) {
      items.push({
        title: title.trim().replace(/<[^>]*>/g, ''),
        link: link.trim(),
        pubDate: pubDate.trim() || undefined,
        description: description.trim().replace(/<[^>]*>/g, '').slice(0, 200),
      });
    }
  }
  
  // Also try Atom format
  if (items.length === 0) {
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/gi;
    while ((match = entryRegex.exec(xml)) !== null) {
      const entryXml = match[1];
      
      const title = entryXml.match(/<title[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i)?.[1] || '';
      const link = entryXml.match(/<link[^>]*href="([^"]*)"[^>]*\/?>/i)?.[1] || '';
      const pubDate = entryXml.match(/<published>([\s\S]*?)<\/published>/i)?.[1] ||
                      entryXml.match(/<updated>([\s\S]*?)<\/updated>/i)?.[1] || '';
      
      if (title && link) {
        items.push({
          title: title.trim().replace(/<[^>]*>/g, ''),
          link: link.trim(),
          pubDate: pubDate.trim() || undefined,
        });
      }
    }
  }
  
  return items;
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  
  if (!url) {
    return NextResponse.json({ error: 'URL parameter required' }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Skylily-Dashboard/1.0',
        'Accept': 'application/rss+xml, application/xml, text/xml, application/atom+xml',
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch feed: ${response.status}`);
    }

    const xml = await response.text();
    const items = parseRSS(xml);

    return NextResponse.json({ items });
  } catch (error) {
    console.error('RSS fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch feed' }, { status: 500 });
  }
}

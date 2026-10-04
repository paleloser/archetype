import { MenuItemGroup } from '.'
import { Description, Header, Label, ListBox } from '@heroui/react'

export default function NavGroup({ item, openItem }: { item: MenuItemGroup, openItem: string | null }) {
  return (
    <ListBox.Section>
      { 
        item.title &&
        <Header>{ item.title }</Header>
      }
      { 
        item.children?.map((item) => 
          <ListBox.Item 
            key={ item.id }
            href={ item.url }
            textValue={ item.title }>
            <div className='flex h-8 items-start justify-center pt-px'>
              { item.icon }
            </div>
            <div className='flex flex-col'>
              <Label className={ `${ openItem === item.id ? 'text-accent' : '' }` }>{ item.title }</Label>
              <Description>{ item.description }</Description>
            </div>
          </ListBox.Item>
        ) 
      }
    </ListBox.Section>
  )
}

-- Function to atomically increment quantity_sold on ticket_types
create or replace function increment_quantity_sold(ticket_type_id_input uuid, amount int)
returns void as $$
begin
  update ticket_types
  set quantity_sold = quantity_sold + amount
  where id = ticket_type_id_input;
end;
$$ language plpgsql security definer;

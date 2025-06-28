use actix_web::web;

mod index;
mod v1;

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(index::index).configure(v1::configure);
}
